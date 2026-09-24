import { fileURLToPath } from "node:url";
import path from "node:path";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const HUB_ROOT = process.env.CFAB_HUB_ROOT || path.resolve(ROOT, "../__c4d");
export const TF_ROOT = process.env.CFAB_TIMEFLOW_ROOT || path.resolve(ROOT, "../__TIMEFLOW/__cfab_demon");
export const OUT_JSON = path.join(ROOT, "src/generated/features_data.json");
export const OUT_PUBLIC_JSON = path.join(ROOT, "public/features_data.json");

// "hub:ścieżka" / "tf:ścieżka" → ścieżka bezwzględna
export function resolveSource(src) {
  const [repo, rel] = src.split(/:(.*)/s);
  if (repo === "hub") return path.join(HUB_ROOT, rel);
  if (repo === "tf") return path.join(TF_ROOT, rel);
  throw new Error(`nieznane repozytorium w źródle: ${src}`);
}
