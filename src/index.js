import bindings from 'bindings';

const {
  createArchive,
  openArchive,
  closeArchive,
  addFile,
  extractFile,
  listFiles
} = bindings('stormlib');

class Archive {
  constructor(filename, options = {}) {
    if (options.create) {
      this.handle = createArchive(filename, options.flags || 0, options.maxFileCount || 1000);
    } else {
      this.handle = openArchive(filename, options.priority || 0, options.flags || 0);
    }
  }

  close() {
    return closeArchive(this.handle);
  }

  addFile(localFilename, archivedName, flags = 0) {
    return addFile(this.handle, localFilename, archivedName, flags);
  }

  extractFile(archivedName, localFilename) {
    return extractFile(this.handle, archivedName, localFilename);
  }

  listFiles() {
    return listFiles(this.handle);
  }
}

export { Archive };