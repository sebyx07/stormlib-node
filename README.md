# StormLib-Node

StormLib-Node 是一个 Node.js 包，为 [StormLib C++ 库](https://github.com/ladislav-zezula/StormLib) 提供绑定，让你在 Node.js 项目中操作 MPQ (Mo'PaQ) 档案文件，适用于《魔兽世界》等暴雪游戏。

StormLib-Node is a Node.js package that provides bindings for the [StormLib C++ library](https://github.com/ladislav-zezula/StormLib), allowing you to work with MPQ (Mo'PaQ) archives in your Node.js projects for World of Warcraft and other Blizzard games.

[中文](#中文) | [English](#english)

---

## 中文

### 目录

- [安装](#安装)
- [使用](#使用)
- [API（中文）](#api中文)
- [开发](#开发)
- [测试](#测试)
- [打包与发布产物](#打包与发布产物)
- [🆕 更新 (v1.1.0)](#更新-v110)
- [贡献](#贡献)
- [许可证](#许可证)
- [致谢](#致谢)

### 安装

```bash
npm install @qq200774491/stormlib-node-bindings
```

### 使用

下面是一个使用 StormLib-Node 的基础示例：

```javascript
import { Archive } from '@qq200774491/stormlib-node-bindings';

// 创建一个新的 MPQ 档案
const archive = new Archive('new_archive.mpq', { create: true });

// 添加文件到档案
archive.addFile('local_file.txt', 'archived_file.txt');

// 从档案中解压文件
archive.extractFile('archived_file.txt', 'extracted_file.txt');

// 列出档案中的文件
const files = archive.listFiles();
console.log('Files in the archive:', files);

// 使用完记得关闭档案
archive.close();
```

### API（中文）

#### `Archive` 类

#### 构造函数：`new Archive(filename, options)`

- `filename`：MPQ 档案路径
- `options`：
    - `create`：布尔值，设为 `true` 表示创建新档案
    - `flags`：可选，创建/打开档案的标志位
    - `maxFileCount`：最大文件数（仅在创建新档案时使用）

#### 方法

- `addFile(localFilename, archivedName, flags = 0)`：向档案中添加文件
- `extractFile(archivedName, localFilename)`：从档案中解压文件
- `listFiles()`：列出档案中的全部文件
- `close()`：关闭档案

### 开发

开发环境配置步骤：

1. 克隆仓库：
   ```bash
   git clone https://github.com/qq200774491/stormlib-node.git
   cd stormlib-node
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 编译 StormLib：
   ```bash
   npm run compile
   ```

4. 构建 Node.js 插件：
   ```bash
   npm run install
   ```

### 测试

运行测试：

```bash
npm test
```

测试使用 Mocha 作为测试运行器，Chai 作为断言库。

### 打包与发布产物

一次性生成二进制 zip（用于上传到 GitHub Release）以及 npm tarball：

```bash
npm run release:pack
```

该命令会重新编译 StormLib、重新编译插件、执行测试套件、将二进制打包为 `dist/stormlib-node-v<version>-<platform>-<arch>.zip`，并把 `npm pack` 产物输出到同一 `dist/` 目录。发布到 GitHub 或 npm 时请上传两个文件。

### 🆕 更新 (v1.1.0)

- Windows 上完整支持 Unicode 路径，包括 MPQ 档案与中文目录中的文件。
- 增加了回归测试，覆盖中文目录/文件名，避免未来回归。
- 改进 StormLib 编译脚本，使用 Visual Studio 2022 并强制 `/MT` 运行库，便于 node-gyp 构建。

### 贡献

欢迎贡献！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建你的特性分支（`git checkout -b feature/AmazingFeature`）
3. 提交你的改动（`git commit -m 'Add some AmazingFeature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 提交 Pull Request

### 许可证

本项目使用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。

### 致谢

- [StormLib](https://github.com/ladislav-zezula/StormLib) by Ladislav Zezula
- 所有提供代码、Bug 报告与建议的贡献者

---

## English

### Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Development](#development)
- [Testing](#testing)
- [Packaging & Release Artifacts](#packaging--release-artifacts)
- [🆕 What's New (v1.1.0)](#whats-new-v110)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

### Installation

```bash
npm install @qq200774491/stormlib-node-bindings
```

### Usage

Here's a basic example of how to use StormLib-Node:

```javascript
import { Archive } from '@qq200774491/stormlib-node-bindings';

// Create a new MPQ archive
const archive = new Archive('new_archive.mpq', { create: true });

// Add a file to the archive
archive.addFile('local_file.txt', 'archived_file.txt');

// Extract a file from the archive
archive.extractFile('archived_file.txt', 'extracted_file.txt');

// List files in the archive
const files = archive.listFiles();
console.log('Files in the archive:', files);

// Don't forget to close the archive when you're done
archive.close();
```

### API

#### `Archive` class

#### Constructor: `new Archive(filename, options)`

- `filename`: Path to the MPQ archive
- `options`:
    - `create`: Boolean, set to `true` to create a new archive
    - `flags`: Optional flags for creating/opening the archive
    - `maxFileCount`: Maximum number of files (only used when creating a new archive)

#### Methods

- `addFile(localFilename, archivedName, flags = 0)`: Add a file to the archive
- `extractFile(archivedName, localFilename)`: Extract a file from the archive
- `listFiles()`: List all files in the archive
- `close()`: Close the archive

### Development

To set up the project for development:

1. Clone the repository:
   ```bash
   git clone https://github.com/qq200774491/stormlib-node.git
   cd stormlib-node
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile StormLib:
   ```bash
   npm run compile
   ```

4. Build the Node.js addon:
   ```bash
   npm run install
   ```

### Testing

To run the tests:

```bash
npm test
```

The tests use Mocha as the test runner and Chai for assertions.

### Packaging & Release Artifacts

Generate the binary zip (for attaching to GitHub) and the npm tarball in one step:

```bash
npm run release:pack
```

This command rebuilds StormLib, recompiles the addon, executes the test suite, bundles the binaries into `dist/stormlib-node-v<version>-<platform>-<arch>.zip`, and runs `npm pack` into the same `dist/` folder. Upload both files as release assets when publishing on GitHub or npm.

### 🆕 What's New (v1.1.0)

- Full Unicode path support on Windows, including MPQ archives and files stored in Chinese directories.
- Added regression tests that exercise Chinese directory/file names to prevent future regressions.
- Improved StormLib compilation script with Visual Studio 2022 + `/MT` runtime enforcement for seamless node-gyp builds.

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### Acknowledgements

- [StormLib](https://github.com/ladislav-zezula/StormLib) by Ladislav Zezula
- All contributors who have helped with code, bug reports, and suggestions
