import { expect } from 'chai';
import { file as tmpFile, dir as tmpDir } from 'tmp-promise';
import fs from 'fs/promises';
import path from 'path';
import { Archive } from '../src/index.js';

describe('StormLib::Archive', function() {
  const testFileContent = 'Hello, World!';
  const archivedFileName = 'archived_test.txt';
  let testMpqPath;
  let tmpDirPath;

  beforeEach(async function() {
    tmpDirPath = await tmpDir({ unsafeCleanup: true });
    testMpqPath = path.join(tmpDirPath.path, 'test.mpq');

    const archive = new Archive(testMpqPath, { create: true });
    const tempFile = await tmpFile();
    await fs.writeFile(tempFile.path, testFileContent);
    archive.addFile(tempFile.path, archivedFileName);
    archive.close();
  });

  afterEach(async function() {
    await tmpDirPath.cleanup();
  });

  describe('#constructor', function() {
    it('creates a new archive', async function() {
      const tempFile = await tmpFile({ postfix: '.mpq' });
      expect(() => new Archive(tempFile.path, { create: true })).to.not.throw();
    });

    it('opens an existing archive', function() {
      expect(() => new Archive(testMpqPath)).to.not.throw();
    });
  });

  describe('#addFile', function() {
    it('adds a file to the archive', async function() {
      const tempMpq = await tmpFile({ postfix: '.mpq' });
      const archive = new Archive(tempMpq.path, { create: true });

      const tempFile = await tmpFile();
      await fs.writeFile(tempFile.path, 'New content');

      expect(archive.addFile(tempFile.path, 'new_archived_file.txt')).to.be.true;
      archive.close();
    });
  });

  describe('#extractFile', function() {
    it('extracts a file from the archive', async function() {
      const archive = new Archive(testMpqPath);
      const extractedFile = await tmpFile();

      expect(archive.extractFile(archivedFileName, extractedFile.path)).to.be.true;
      const content = await fs.readFile(extractedFile.path, 'utf8');
      expect(content).to.equal(testFileContent);

      archive.close();
    });
  });

  describe('#close', function() {
    it('closes the archive without errors', function() {
      const archive = new Archive(testMpqPath);
      expect(() => archive.close()).to.not.throw();
    });
  });

  describe('#listFiles', function() {
    it('lists files in the archive', function() {
      const archive = new Archive(testMpqPath);
      const fileList = archive.listFiles();

      expect(fileList).to.be.an('array');
      expect(fileList).to.include(archivedFileName);

      archive.close();
    });
  });
});