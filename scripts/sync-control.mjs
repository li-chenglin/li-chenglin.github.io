import { spawn } from "node:child_process";
import { closeSync, mkdirSync, openSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { lockDir, readRunningPID, root, scriptPath, stateDir } from "./auto-sync.mjs";

const action = process.argv[2];
const pid = await readRunningPID();
const logPath = resolve(stateDir, "sync.log");

if (action === "start") {
  if (pid) {
    console.log(`Auto-sync is already running (PID ${pid}).`);
  } else {
    mkdirSync(stateDir, { recursive: true });
    rmSync(lockDir, { recursive: true, force: true });
    const log = openSync(logPath, "a");
    const child = spawn(process.execPath, [scriptPath, "watch"], {
      cwd: root, detached: true, stdio: ["ignore", log, log],
    });
    child.on("error", error => { console.error(error.message); process.exitCode = 1; });
    child.unref();
    closeSync(log);
    await new Promise(resolve => setTimeout(resolve, 1_000));
    if (!await readRunningPID()) throw new Error(`Could not start auto-sync. See ${logPath}`);
    console.log("Auto-sync started in the background. Saves publish after 30 quiet seconds.");
  }
  console.log(`Log: ${logPath}`);
} else if (action === "stop") {
  if (pid) {
    // Also stop an in-flight build or push belonging to this detached process group.
    process.kill(-pid, "SIGTERM");
    console.log("Auto-sync stopped. An update already sent to GitHub may still finish deploying.");
  } else {
    console.log("Auto-sync is not running.");
  }
} else if (action === "status") {
  console.log(pid ? `Auto-sync running (PID ${pid}).` : "Auto-sync is stopped.");
  console.log(`Log: ${logPath}`);
} else {
  console.error("Usage: node scripts/sync-control.mjs start|stop|status");
  process.exitCode = 1;
}
