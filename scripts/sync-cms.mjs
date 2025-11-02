import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const envPath = path.join(root, ".env");
const from = path.join(root, "cms", "admin");
const to = path.join(root, "public", "admin");

async function loadEnvFromFile() {
  if (!fs.existsSync(envPath)) {
    return;
  }
  const content = await fsp.readFile(envPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }
    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) {
      continue;
    }
    const key = line.slice(0, eqIndex).trim();
    const value = line.slice(eqIndex + 1).trim();
    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

async function copyDir(src, dest) {
  await fsp.mkdir(dest, { recursive: true });
  for (const entry of await fsp.readdir(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fsp.copyFile(srcPath, destPath);
    }
  }
}

async function rmDirSafe(dir) {
  if (fs.existsSync(dir)) {
    await fsp.rm(dir, { recursive: true, force: true });
  }
}

(async () => {
  await loadEnvFromFile();
  const enable =
    process.env.PUBLIC_ENABLE_CMS === "true" ||
    process.env.PUBLIC_PLAN === "cms";
  if (enable) {
    if (!fs.existsSync(from)) {
      console.warn("[sync-cms] cms/admin introuvable, rien à copier.");
      return;
    }
    await rmDirSafe(to);
    await copyDir(from, to);
    console.log("[sync-cms] CMS activé → /public/admin copié");
  } else {
    await rmDirSafe(to);
    console.log("[sync-cms] CMS désactivé → /public/admin supprimé");
  }
})();
