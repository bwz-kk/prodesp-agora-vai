import path from "path";

// Diretório "public" do front-end. Resolve corretamente em dev (src/) e em produção (dist/):
// - src/utils/paths.ts  → project/public
// - dist/utils/paths.js → dist/public (copiado no build)
export function resolvePublicDir(): string {
  return path.resolve(__dirname, "../public");
}