import { execSync } from 'child_process';
import { copyFileSync, existsSync, mkdirSync, rmSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import os from 'os';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distRoot = path.join(rootDir, 'dist');

function log(step, message) {
  console.log(`\n[${step}] ${message}`);
}

function run(command, options = {}) {
  console.log(`$ ${command}`);
  execSync(command, { stdio: 'inherit', cwd: rootDir, ...options });
}

function ensureDir(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

function copyIfExists(source, targetDir) {
  if (!existsSync(source)) {
    console.warn(`Warning: ${source} not found, skipping.`);
    return null;
  }
  const target = path.join(targetDir, path.basename(source));
  copyFileSync(source, target);
  return target;
}

function compressFolder(sourceDir, zipPath) {
  if (existsSync(zipPath)) {
    rmSync(zipPath);
  }

  if (process.platform === 'win32') {
    const psCommand = `Compress-Archive -Path \"${sourceDir}\\*\" -DestinationPath \"${zipPath}\" -Force`;
    run(`powershell -NoProfile -Command "${psCommand}"`);
  } else if (process.platform === 'darwin' || process.platform === 'linux') {
    run(`zip -r ${JSON.stringify(zipPath)} .`, { cwd: sourceDir });
  } else {
    throw new Error('Unsupported platform for compression.');
  }
}

 (function main() {
  log('1', 'Building StormLib and native addon');
  run('npm run compile');
  run('npx node-gyp rebuild');

  log('2', 'Running tests');
  run('npm test');

  const versionLabel = `v${pkg.version}`;
  const platformLabel = `${os.platform()}-${os.arch()}`;
  const artifactDir = path.join(distRoot, versionLabel, platformLabel);
  const zipName = `stormlib-node-${versionLabel}-${platformLabel}.zip`;
  const zipPath = path.join(distRoot, zipName);

  log('3', `Collecting artifacts into ${artifactDir}`);
  if (existsSync(artifactDir)) {
    rmSync(artifactDir, { recursive: true, force: true });
  }
  ensureDir(artifactDir);

  const addonBinary = path.join(rootDir, 'build', 'Release', 'stormlib.node');
  const stormLibBinary = path.join(rootDir, 'StormLib', 'build', 'Release', 'StormLib.lib');

  const copied = [
    copyIfExists(addonBinary, artifactDir),
    copyIfExists(stormLibBinary, artifactDir)
  ].filter(Boolean);

  if (!copied.length) {
    throw new Error('No artifacts were copied. Ensure the build step succeeded.');
  }

  log('4', `Compressing artifacts to ${zipPath}`);
  ensureDir(distRoot);
  compressFolder(artifactDir, zipPath);

  log('5', 'Creating npm package tarball via npm pack');
  run(`npm pack --pack-destination ${JSON.stringify(distRoot)}`);

  console.log('\nRelease artifacts ready:');
  console.log(` - Binary bundle: ${zipPath}`);
  console.log(' - npm tarball:');
  readdirSync(distRoot)
    .filter((file) => file.endsWith('.tgz'))
    .forEach((file) => console.log(`     dist/${file}`));
})();
