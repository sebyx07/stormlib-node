import { expect } from 'chai';
import { dir as tmpDir } from 'tmp-promise';
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
    const sourcePath = path.join(tmpDirPath.path, 'source.txt');
    await fs.writeFile(sourcePath, testFileContent);
    expect(archive.addFile(sourcePath, archivedFileName)).to.be.true;
    archive.close();
  });

  afterEach(async function() {
    await tmpDirPath.cleanup();
  });

  describe('#constructor', function() {
    it('creates a new archive', async function() {
      const tempDir = await tmpDir({ unsafeCleanup: true });
      const archivePath = path.join(tempDir.path, 'new.mpq');
      let archive;

      expect(() => {
        archive = new Archive(archivePath, { create: true });
      }).to.not.throw();

      archive.close();
      await tempDir.cleanup();
    });

    it('opens an existing archive', function() {
      expect(() => {
        const archive = new Archive(testMpqPath);
        archive.close();
      }).to.not.throw();
    });
  });

  describe('#addFile', function() {
    it('adds a file to the archive', async function() {
      const tempDirForArchive = await tmpDir({ unsafeCleanup: true });
      const tempMpqPath = path.join(tempDirForArchive.path, 'temp.mpq');
      const archive = new Archive(tempMpqPath, { create: true });

      const sourcePath = path.join(tempDirForArchive.path, 'new-file.txt');
      await fs.writeFile(sourcePath, 'New content');

      try {
        expect(archive.addFile(sourcePath, 'new_archived_file.txt')).to.be.true;
      } finally {
        archive.close();
        await tempDirForArchive.cleanup();
      }
    });
  });

  describe('#extractFile', function() {
    it('extracts a file from the archive', async function() {
      const archive = new Archive(testMpqPath);
      const extractDir = await tmpDir({ unsafeCleanup: true });
      const destinationPath = path.join(extractDir.path, 'extracted.txt');

      try {
        expect(archive.extractFile(archivedFileName, destinationPath)).to.be.true;
        const content = await fs.readFile(destinationPath, 'utf8');
        expect(content).to.equal(testFileContent);
      } finally {
        archive.close();
        await extractDir.cleanup();
      }
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