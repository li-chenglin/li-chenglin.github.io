import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { basename, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const source = resolve(root, "Chenglin_Li_CV_Overleaf.tex");
const buildDir = resolve(root, ".cv-build");
const output = resolve(root, "public", "cv.pdf");
const builtPdf = resolve(buildDir, basename(source, ".tex") + ".pdf");

if (!existsSync(source)) {
  console.error(`CV source not found: ${source}`);
  process.exit(1);
}

mkdirSync(buildDir, { recursive: true });

const result = spawnSync(
  "latexmk",
  [
    "-pdf",
    "-interaction=nonstopmode",
    "-halt-on-error",
    `-outdir=${buildDir}`,
    source,
  ],
  {
    cwd: root,
    stdio: "inherit",
  },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

copyFileSync(builtPdf, output);
console.log(`Updated ${output}`);
