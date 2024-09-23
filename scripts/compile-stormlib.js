import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const STORMLIB_REPO = 'https://github.com/ladislav-zezula/StormLib.git';
const STORMLIB_DIR = join(process.cwd(), 'StormLib');

function runCommand(command) {
  console.log(`Running: ${command}`);
  execSync(command, { stdio: 'inherit' });
}

function compileStormLib() {
  if (!existsSync(STORMLIB_DIR)) {
    console.log('Cloning StormLib repository...');
    runCommand(`git clone ${STORMLIB_REPO} ${STORMLIB_DIR}`);
  } else {
    console.log('StormLib directory already exists. Updating...');
    runCommand(`cd ${STORMLIB_DIR} && git pull`);
  }

  console.log('Compiling StormLib...');
  const buildDir = join(STORMLIB_DIR, 'build');
  if (!existsSync(buildDir)) {
    mkdirSync(buildDir);
  }

  process.chdir(buildDir);

  if (process.platform === 'win32') {
    runCommand('cmake .. -G "Visual Studio 16 2019" -A x64 -DCMAKE_POSITION_INDEPENDENT_CODE=ON');
    runCommand('cmake --build . --config Release');
  } else {
    runCommand('cmake .. -DCMAKE_POSITION_INDEPENDENT_CODE=ON');
    runCommand('make CFLAGS="-fPIC" CXXFLAGS="-fPIC"');
  }

  console.log('StormLib compilation completed.');
}

compileStormLib();