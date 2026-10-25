import { cp, mkdir } from "node:fs/promises";

const publicDirectory = new URL("../public/", import.meta.url);
await mkdir(publicDirectory, { recursive: true });

for (const file of [
  "index.html",
  "roadmap.html",
  "database.html",
  "activity.html",
  "styles.css",
  "app.js",
]) {
  await cp(
    new URL(`../${file}`, import.meta.url),
    new URL(file, publicDirectory),
  );
}
