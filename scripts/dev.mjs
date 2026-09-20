import { spawn } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const nextBin = resolve(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "next.cmd" : "next",
);

const processes = [
  spawn("node", ["scripts/watch-cv.mjs"], {
    cwd: root,
    stdio: "inherit",
  }),
  spawn(nextBin, ["dev", "--turbopack"], {
    cwd: root,
    stdio: "inherit",
  }),
];

function shutdown(signal) {
  for (const child of processes) {
    if (!child.killed) {
      child.kill(signal);
    }
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

for (const child of processes) {
  child.on("exit", (code, signal) => {
    if (code && code !== 0) {
      shutdown("SIGTERM");
      process.exit(code);
    }
    if (signal) {
      shutdown(signal);
    }
  });
}
