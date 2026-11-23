import { readFileSync, readdirSync } from "node:fs";

const SITE = "https://klyx.fr";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const KEY_FILE = /^[0-9a-f]{32}\.txt$/;

const dryRun = process.argv.includes("--dry-run");

const keyFile = readdirSync("public").find((file) => KEY_FILE.test(file));
if (!keyFile) throw new Error("No IndexNow key file in public/");
const key = readFileSync(`public/${keyFile}`, "utf8").trim();
if (`${key}.txt` !== keyFile) {
  throw new Error(`public/${keyFile} must contain its own name as the key`);
}

const sitemap = await fetch(`${SITE}/sitemap.xml`);
if (!sitemap.ok) throw new Error(`Sitemap answered ${sitemap.status}`);
const urlList = [
  ...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g),
].map(([, url]) => url);
if (urlList.length === 0) throw new Error("The sitemap lists no URL");

if (dryRun) {
  console.log(urlList.join("\n"));
  console.log(`${urlList.length} URLs, not submitted (--dry-run)`);
  process.exit(0);
}

const response = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key,
    keyLocation: `${SITE}/${keyFile}`,
    urlList,
  }),
});
if (!response.ok) {
  throw new Error(
    `IndexNow answered ${response.status}: ${await response.text()}`,
  );
}
console.log(`IndexNow took ${urlList.length} URLs (${response.status})`);
