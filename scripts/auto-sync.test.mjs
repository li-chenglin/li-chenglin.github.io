import assert from "node:assert/strict";
import { mkdtemp, mkdir, rename, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { FilesChanged, git, publish, snapshot } from "./auto-sync.mjs";

async function fixture(t) {
  const parent = await mkdtemp("/tmp/homepage-sync-test-");
  t.after(() => rm(parent, { recursive: true, force: true }));
  const cwd = join(parent, "work");
  const remote = join(parent, "remote.git");
  await mkdir(cwd);
  await git(parent, ["init", "--bare", remote]);
  await git(cwd, ["init", "-b", "main"]);
  await git(cwd, ["config", "user.name", "Sync Test"]);
  await git(cwd, ["config", "user.email", "sync-test@example.invalid"]);
  await writeFile(join(cwd, ".gitignore"), ".env*\n.auto-sync/\n.next-auto-sync/\n");
  await writeFile(join(cwd, "page.txt"), "Original content");
  await git(cwd, ["add", "."]);
  await git(cwd, ["commit", "-m", "Initial"]);
  await git(cwd, ["remote", "add", "pages", remote]);
  await git(cwd, ["push", "pages", "main"]);
  const options = { expectedRemote: remote, validate: async () => {}, log: () => {} };
  return { parent, cwd, remote, options };
}

test("repeated saves are detected and ignored files do not trigger publication", async t => {
  const { cwd } = await fixture(t);
  await writeFile(join(cwd, "page.txt"), "First draft");
  const first = await snapshot(cwd);
  await writeFile(join(cwd, "page.txt"), "Final draft");
  const second = await snapshot(cwd);
  assert.notEqual(first.key, second.key);
  await writeFile(join(cwd, ".env.local"), "PRIVATE=local-only");
  assert.equal((await snapshot(cwd)).key, second.key);
});

test("successful publication includes additions, renames and deletions", async t => {
  const { cwd, remote, options } = await fixture(t);
  await rename(join(cwd, "page.txt"), join(cwd, "renamed page.txt"));
  await writeFile(join(cwd, "new page.txt"), "New content");
  await publish(cwd, options);
  assert.equal((await snapshot(cwd)).dirty, false);
  assert.equal((await git(cwd, ["rev-parse", "HEAD"])).trim(), (await git(remote, ["rev-parse", "main"])).trim());
  await rm(join(cwd, "new page.txt"));
  await publish(cwd, options);
  assert.equal((await snapshot(cwd)).dirty, false);
});

test("build failure and edits during build do not create a commit", async t => {
  const { cwd, options } = await fixture(t);
  await writeFile(join(cwd, "page.txt"), "Unfinished draft");
  const head = await git(cwd, ["rev-parse", "HEAD"]);
  await assert.rejects(publish(cwd, { ...options, validate: async () => { throw new Error("Build failed"); } }), /Build failed/);
  assert.equal(await git(cwd, ["rev-parse", "HEAD"]), head);
  await assert.rejects(publish(cwd, {
    ...options,
    validate: () => writeFile(join(cwd, "page.txt"), "Changed during build"),
  }), FilesChanged);
  assert.equal(await git(cwd, ["rev-parse", "HEAD"]), head);
});

test("CV edits compile and commit the generated PDF", async t => {
  const { cwd, remote, options } = await fixture(t);
  await writeFile(join(cwd, "Chenglin_Li_CV_Overleaf.tex"), "Updated CV");
  await mkdir(join(cwd, "public"));
  let compiled = false;
  await publish(cwd, {
    ...options,
    compileCV: async () => {
      compiled = true;
      await writeFile(join(cwd, "public", "cv.pdf"), "New PDF");
    },
  });
  assert.equal(compiled, true);
  assert.equal(await git(remote, ["show", "main:public/cv.pdf"]), "New PDF");
});

test("failed push can retry without rebuilding or duplicating the commit", async t => {
  const { parent, cwd, remote, options } = await fixture(t);
  await writeFile(join(cwd, "page.txt"), "Ready to publish");
  const offline = join(parent, "offline.git");
  await rename(remote, offline);
  await assert.rejects(publish(cwd, options));
  const committed = await git(cwd, ["rev-parse", "HEAD"]);
  assert.equal((await snapshot(cwd)).dirty, false);
  await rename(offline, remote);
  await publish(cwd, { ...options, validate: async () => { throw new Error("Should not rebuild"); } });
  assert.equal(await git(cwd, ["rev-parse", "HEAD"]), committed);
  assert.equal((await git(remote, ["rev-parse", "main"])).trim(), committed.trim());
});

test("other branches and changed remotes are never published", async t => {
  const { cwd, options } = await fixture(t);
  await git(cwd, ["checkout", "-b", "draft"]);
  await assert.rejects(publish(cwd, options), /only publishes main/);
  await git(cwd, ["checkout", "main"]);
  await assert.rejects(publish(cwd, { ...options, expectedRemote: "unexpected" }), /remote has changed/);
});
