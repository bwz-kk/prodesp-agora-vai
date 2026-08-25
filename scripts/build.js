// Pós-build: prepara dist/ para deploy standalone no Prisma Compute.
// O runtime (bun) recebe apenas o outputDirectory, sem node_modules —
// então instalamos as dependências de produção dentro de dist/.
const fs = require("fs");
const { execSync } = require("child_process");

fs.rmSync("dist/public", { recursive: true, force: true });
fs.cpSync("public", "dist/public", { recursive: true });

fs.copyFileSync("package.json", "dist/package.json");
fs.copyFileSync("package-lock.json", "dist/package-lock.json");

execSync("npm ci --omit=dev --ignore-scripts --no-audit --no-fund", {
  cwd: "dist",
  stdio: "inherit",
});
