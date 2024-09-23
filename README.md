# StormLib-Node 🌪️

StormLib-Node is a Node.js package that provides bindings for the [StormLib C++ library](https://github.com/ladislav-zezula/StormLib), allowing you to work with MPQ (Mo'PaQ) archives in your Node.js projects for World of Warcraft and other Blizzard games.

## 📋 Table of Contents

- [Installation](#-installation)
- [Usage](#-usage)
- [API](#-api)
- [Development](#-development)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Installation

```bash
npm install stormlib-node
```

## 🛠️ Usage

Here's a basic example of how to use StormLib-Node:

```javascript
import { Archive } from 'stormlib-node';

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

## 📚 API

### `Archive` class

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

## 🧪 Development

To set up the project for development:

1. Clone the repository:
   ```
   git clone https://github.com/sebyx07/stormlib-node.git
   cd stormlib-node
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Compile StormLib:
   ```
   npm run compile
   ```

4. Build the Node.js addon:
   ```
   npm run install
   ```

## 🧬 Testing

To run the tests:

```
npm test
```

The tests use Mocha as the test runner and Chai for assertions.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [StormLib](https://github.com/ladislav-zezula/StormLib) by Ladislav Zezula
- All contributors who have helped with code, bug reports, and suggestions