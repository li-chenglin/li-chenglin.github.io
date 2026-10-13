import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { copyFile, lstat, mkdir, readFile, readlink, rm, symlink } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execute = promisify(execFile);
export const root = resolve(import.meta.dirname, "..");
export const stateDir = resolve(root, ".auto-sync");
export const lockDir = resolve(stateDir, "lock");
export const scriptPath = fileURLToPath(import.meta.url);
const cvSource = "Chenglin_Li_CV_Overleaf.tex";
const publicRemote = "git@github.com:li-chenglin/li-chenglin.github.io.git";
const quietMs = 30_000;

export async function git(cwd, args) {
  const result = await execute("git", args, {
    cwd,
    timeout: 120_000,
    maxBuffer: 16 * 1024 * 1024,
    env: {
      ...process.env,
      GIT_TERMINAL_PROMPT: "0",
      GIT_SSH_COMMAND: process.env.GIT_SSH_COMMAND ?? "ssh -o BatchMode=yes -o ConnectTimeout=15",
    },
  });
  return result.stdout;
}

// Include file contents: Git status alone does not change on repeated saves.
export async function snapshot(cwd) {
  const head = (await git(cwd, ["rev-parse", "HEAD"])).trim();
  const status = await git(cwd, ["status", "--porcelain=v1", "-z", "--untracked-files=all"]);
  const records = status.split("\0");
  const paths = new Set();
  for (let i = 0; i < records.length; i++) {
    if (!records[i]) continue;
    paths.add(records[i].slice(3));
    if (/[RC]/.test(records[i].slice(0, 2))) paths.add(records[++i]);
  }
  const files = [];
  for (const path of [...paths].sort()) {
    let digest = "deleted";
    try {
      const absolute = resolve(cwd, path);
      const info = await lstat(absolute);
      const content = info.isSymbolicLink() ? await readlink(absolute) : await readFile(absolute);
      digest = createHash("sha256").update(content).update(String(info.mode)).digest("hex");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    files.push([path, digest]);
  }
  return { head, files, dirty: files.length > 0, key: JSON.stringify([head, files]) };
}

export class FilesChanged extends Error {
  constructor() { super("Files changed during preparation; waiting for saves to finish."); }
}

async function assertReady(cwd, expectedRemote) {
  if ((await git(cwd, ["branch", "--show-current"])).trim() !== "main") {
    throw new Error("Auto-sync only publishes main. Switch back to main to resume.");
  }
  if ((await git(cwd, ["remote", "get-url", "--push", "pages"])).trim() !== expectedRemote) {
    throw new Error("The pages remote has changed; publication stopped.");
  }
  const gitDir = resolve(cwd, (await git(cwd, ["rev-parse", "--git-dir"])).trim());
  for (const marker of ["MERGE_HEAD", "CHERRY_PICK_HEAD", "REVERT_HEAD", "rebase-merge", "rebase-apply"]) {
    if (existsSync(resolve(gitDir, marker))) throw new Error("Finish the current Git operation before auto-sync resumes.");
  }
}

async function buildCV(cwd) {
  await execute(process.execPath, ["scripts/build-cv.mjs"], {
    cwd, timeout: 120_000, maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, SKIP_CV_BUILD: "0" },
  });
}

export async function buildSite(cwd) {
  // Export builds always use .next internally. Build a separate source copy so
  // validation cannot replace the running local preview's cache.
  const workspace = resolve(cwd, ".auto-sync", "build");
  await rm(workspace, { recursive: true, force: true });
  await mkdir(workspace, { recursive: true });
  const paths = (await git(cwd, ["ls-files", "-z", "--cached", "--others", "--exclude-standard"])).split("\0");
  for (const path of new Set(paths.filter(Boolean))) {
    const source = resolve(cwd, path);
    const destination = resolve(workspace, path);
    try {
      const info = await lstat(source);
      await mkdir(dirname(destination), { recursive: true });
      if (info.isSymbolicLink()) await symlink(await readlink(source), destination);
      else await copyFile(source, destination);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  await symlink(resolve(cwd, "node_modules"), resolve(workspace, "node_modules"), "dir");
  await execute(process.execPath, [resolve(cwd, "node_modules/next/dist/bin/next"), "build", "--turbopack", "--no-lint"], {
    cwd: workspace, timeout: 300_000, maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, HOMEPAGE_BUILD_ROOT: cwd },
  });
}

export async function publish(cwd, {
  expectedRemote = publicRemote,
  validate = buildSite,
  compileCV = buildCV,
  log = console.log,
} = {}) {
  await assertReady(cwd, expectedRemote);
  let before = await snapshot(cwd);
  if (before.dirty) {
    if (before.files.some(([path]) => path === cvSource)) {
      log("Building CV PDF...");
      await compileCV(cwd);
      const afterCV = await snapshot(cwd);
      const withoutPDF = s => JSON.stringify([s.head, s.files.filter(([p]) => p !== "public/cv.pdf")]);
      if (withoutPDF(before) !== withoutPDF(afterCV)) throw new FilesChanged();
      before = afterCV;
    }
    log("Checking production build...");
    await validate(cwd);
    await assertReady(cwd, expectedRemote);
    if ((await snapshot(cwd)).key !== before.key) throw new FilesChanged();
    await git(cwd, ["add", "-A", "--", "."]);
    if ((await snapshot(cwd)).key !== before.key) throw new FilesChanged();
    await git(cwd, ["commit", "-m", "Auto-update homepage"]);
  }
  const ahead = (await git(cwd, ["rev-list", "--count", "refs/remotes/pages/main..HEAD"])).trim();
  if (Number(ahead) > 0) {
    log("Pushing to GitHub Pages...");
    await git(cwd, ["push", "pages", "main"]);
    log("Pushed. GitHub Pages is now building the public website.");
  }
}

export async function readRunningPID() {
  try {
    const pid = Number(readFileSync(resolve(lockDir, "pid"), "utf8"));
    if (!Number.isSafeInteger(pid) || pid <= 0) return null;
    const { stdout } = await execute("ps", ["-p", String(pid), "-o", "command="]);
    return stdout.includes(scriptPath) && stdout.includes("watch") ? pid : null;
  } catch { return null; }
}

async function watch() {
  mkdirSync(stateDir, { recursive: true });
  // Atomic lock prevents two background watchers committing at the same time.
  try { mkdirSync(lockDir); } catch (error) {
    if (error.code !== "EEXIST") throw error;
    throw new Error("A sync lock already exists. Use npm run sync:start to recover a stale lock.");
  }
  writeFileSync(resolve(lockDir, "pid"), String(process.pid));
  const log = message => console.log(`[${new Date().toISOString()}] ${message}`);
  const release = () => rmSync(lockDir, { recursive: true, force: true });
  process.on("exit", release);
  process.on("SIGTERM", () => process.exit(0));
  process.on("SIGINT", () => process.exit(0));
  log("Auto-sync active. Saves publish after 30 quiet seconds. Remote: pages/main.");
  let previous;
  let changedAt = Date.now();
  let retryAt = 0;
  let pending = true;
  for (;;) {
    try {
      const current = await snapshot(root);
      if (current.key !== previous) {
        previous = current.key;
        changedAt = Date.now();
        retryAt = 0;
        pending = true;
        if (current.dirty) log("Changes detected; waiting for saves to finish.");
      }
      if (pending && Date.now() - changedAt >= quietMs && Date.now() >= retryAt) {
        await publish(root, { log });
        const after = await snapshot(root);
        previous = after.key;
        pending = after.dirty;
        changedAt = Date.now();
      }
    } catch (error) {
      if (error instanceof FilesChanged) {
        log(error.message);
        previous = undefined;
      } else {
        const detail = [error.message, error.stdout, error.stderr].filter(Boolean).join("\n").slice(-12_000);
        log(`Sync paused; retrying in 60 seconds. ${detail}`);
        retryAt = Date.now() + 60_000;
      }
    }
    await new Promise(resolve => setTimeout(resolve, 3_000));
  }
}

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  watch().catch(error => { console.error(error.message); process.exitCode = 1; });
}
