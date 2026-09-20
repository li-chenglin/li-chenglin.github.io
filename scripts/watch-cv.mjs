import { watch } from "node:fs";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const source = resolve(root, "Chenglin_Li_CV_Overleaf.tex");

let running = false;
let pending = false;
let timer;

function build() {
  if (running) {
    pending = true;
    return;
  }

  running = true;
  const child = spawn("node", ["scripts/build-cv.mjs"], {
    cwd: root,
    stdio: "inherit",
  });

  child.on("exit", () => {
    running = false;
    if (pending) {
      pending = false;
      build();
    }
  });
}

function scheduleBuild() {
  clearTimeout(timer);
  timer = setTimeout(build, 300);
}

build();
watch(source, scheduleBuild);
console.log(`Watching ${source}`);
