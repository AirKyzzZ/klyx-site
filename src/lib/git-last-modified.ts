import { execFileSync } from "node:child_process";

export function gitLastModified(paths: readonly string[]): string | undefined {
  const date = execFileSync(
    "git",
    ["log", "-1", "--format=%cs", "--", ...paths],
    { encoding: "utf8" },
  ).trim();
  return date || undefined;
}
