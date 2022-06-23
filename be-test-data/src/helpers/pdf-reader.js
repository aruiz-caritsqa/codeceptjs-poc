const fs = require('fs');
const pdf = require('pdf-parse');

/**
 * Reads the contents of a PDF file and converts it into plain text
 * @param {String} filepath
 * @example
 * const { readPdfFile } = require('be-test-data');
 * const main = async () => {
 *   const pdfText = await readPdfFile('./path/to-file');
 *   console.log(pdfText);
 * }
 * main();
 * @throws {Error} If cannot find file
 * @returns {Promise<String>}
 */
const readPdfFile = async (filepath) => {
  if (!fs.existsSync(filepath)) {
    throw new Error(`Cannot find the file ${filepath}`);
  }

  const dataBuffer = fs.readFileSync(filepath);
  const { text } = await pdf(dataBuffer);
  return text;
};

module.exports = {
  readPdfFile,
};
