import { spawnSync } from 'child_process';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { cwd, platform, chdir } from 'process';

const STORMLIB_REPO = 'https://github.com/ladislav-zezula/StormLib.git';
const STORMLIB_DIR = join(cwd(), 'StormLib');

function runCommand(cmd, args = [], options = {}) {
  console.log(`Running: ${cmd} ${args.join(' ')}`);
  const result = spawnSync(cmd, args, { stdio: 'inherit', ...options });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`Command failed with exit code ${result.status}`);
  }
  return result;
}

function getCMakePath() {
  // 1. Try to find cmake in global PATH
  try {
    runCommand('cmake', ['--version'], { stdio: 'ignore' });
    return 'cmake';
  } catch (e) {
    // Not found in PATH, continue searching
  }

  // 2. On Windows, try to find cmake bundled with Visual Studio using vswhere
  if (platform === 'win32') {
    try {
      // Standard installation path of vswhere
      const vswherePath = join(
        process.env['ProgramFiles(x86)'] || process.env['ProgramFiles'],
        'Microsoft Visual Studio',
        'Installer',
        'vswhere.exe'
      );

      if (existsSync(vswherePath)) {
        // Use vswhere to find VS instance with CMake component installed
        const result = runCommand(vswherePath, [
          '-latest',
          '-products', '*',
          '-requires', 'Microsoft.VisualStudio.Component.VC.CMake.Project',
          '-find', '**\\bin\\cmake.exe'
        ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });

        if (result.stdout) {
          const output = result.stdout.trim();
          if (output && existsSync(output)) {
            console.log(`[Build] Found VS CMake at: ${output}`);
            return output;
          }
        }
      }
    } catch (e) {
      // Search failed, ignore
    }
  }

  // 3. CMake not found anywhere, throw helpful error
  console.error('\x1b[31m%s\x1b[0m', 'Error: CMake not found in PATH nor in Visual Studio.');
  console.error('\x1b[33m%s\x1b[0m', 'Hint: Install CMake via "winget install Kitware.CMake" OR run this in "Developer PowerShell for VS".');
  process.exit(1);
}

function compileStormLib() {
  if (!existsSync(STORMLIB_DIR)) {
    console.log('Cloning StormLib repository...');
    runCommand('git', ['clone', STORMLIB_REPO, STORMLIB_DIR]);
  } else {
    console.log('StormLib directory already exists. Updating...');
    runCommand('git', ['pull'], { cwd: STORMLIB_DIR });
  }

  console.log('Compiling StormLib...');
  const buildDir = join(STORMLIB_DIR, 'build');
  if (existsSync(buildDir)) {
    rmSync(buildDir, { recursive: true, force: true });
  }
  mkdirSync(buildDir);

  chdir(buildDir);

  if (platform === 'win32') {
    const cmakePath = getCMakePath();

    // CMake configuration phase
    runCommand(cmakePath, [
      '..',
      '-G', 'Visual Studio 17 2022',
      '-A', 'x64',
      '-DCMAKE_POSITION_INDEPENDENT_CODE=ON',
      '-DCMAKE_POLICY_DEFAULT_CMP0091=NEW',
      '-DCMAKE_MSVC_RUNTIME_LIBRARY=MultiThreaded',
      '-DCMAKE_C_FLAGS_RELEASE=/MT',
      '-DCMAKE_CXX_FLAGS_RELEASE=/MT',
      '-DCMAKE_C_FLAGS_DEBUG=/MTd',
      '-DCMAKE_CXX_FLAGS_DEBUG=/MTd'
    ]);

    // CMake build phase
    runCommand(cmakePath, ['--build', '.', '--config', 'Release']);
  } else {
    runCommand('cmake', ['..', '-DCMAKE_POSITION_INDEPENDENT_CODE=ON']);
    runCommand('make', ['CFLAGS=-fPIC', 'CXXFLAGS=-fPIC']);
  }

  console.log('StormLib compilation completed.');
}

compileStormLib();