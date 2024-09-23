import { Archive } from 'stormlib-node-bindings';
import { writeFile, readFile, unlink } from 'fs/promises';

async function runTest() {
  try {
    // Test creating a new archive
    const archive = new Archive('test.mpq', { create: true });

    // Add a file to the archive
    const testContent = 'Hello, World!';
    const tempFilePath = 'temp-test-file.txt';
    await writeFile(tempFilePath, testContent);
    archive.addFile(tempFilePath, 'test.txt');

    // List files in the archive
    const files = archive.listFiles();
    console.log('Files in archive:', files);

    // Extract the file
    archive.extractFile('test.txt', 'extracted-test.txt');

    // Read the extracted file
    const extractedContent = await readFile('extracted-test.txt', 'utf8');
    console.log('Extracted content:', extractedContent);

    // Close the archive
    archive.close();

    // Clean up
    await Promise.all([
      unlink(tempFilePath),
      unlink('test.mpq'),
      unlink('extracted-test.txt')
    ]);

    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTest();