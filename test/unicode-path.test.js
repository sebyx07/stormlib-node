import { expect } from 'chai';
import { dir as tmpDir } from 'tmp-promise';
import fs from 'fs/promises';
import path from 'path';
import { Archive } from '../src/index.js';

const chineseDirName = '中文路径-测试';
const chineseMpqName = '资料包-测试.mpq';
const archivedName = '中文/存档文件.txt';
const sourceFileName = '源文件-你好.txt';
const extractedFileName = '输出文件-再见.txt';
const fileContent = '来自中文路径的内容';

describe('StormLib::UnicodePaths', function() {
  it('handles Chinese directory and file paths', async function() {
    const tempDir = await tmpDir({ unsafeCleanup: true });
    const baseDir = tempDir.path;
    const chineseDir = path.join(baseDir, chineseDirName);

    await fs.mkdir(chineseDir, { recursive: true });

    const mpqPath = path.join(chineseDir, chineseMpqName);
    const sourcePath = path.join(chineseDir, sourceFileName);
    const extractedPath = path.join(chineseDir, extractedFileName);

    await fs.writeFile(sourcePath, fileContent, 'utf8');

    let createdArchive;
    let openedArchive;

    try {
      createdArchive = new Archive(mpqPath, { create: true, maxFileCount: 16 });
      expect(createdArchive.addFile(sourcePath, archivedName)).to.be.true;
      createdArchive.close();
      createdArchive = null;

      openedArchive = new Archive(mpqPath);
      expect(openedArchive.listFiles()).to.include(archivedName);
      expect(openedArchive.extractFile(archivedName, extractedPath)).to.be.true;
      const extractedContent = await fs.readFile(extractedPath, 'utf8');
      expect(extractedContent).to.equal(fileContent);
      openedArchive.close();
      openedArchive = null;
    } finally {
      if (createdArchive) {
        createdArchive.close();
      }
      if (openedArchive) {
        openedArchive.close();
      }
      await tempDir.cleanup();
    }
  });
});
