const marked = require('marked');

/**
 * Convert MarkDown table into an array
 * @param {String} markdownInput
 * @example
 * const { mdTableToJson } = require('be-test-data');
 * const main = async () => {
 *   const table = `
 *  | desc           | statement | expValue |
 *  |----------------|-----------|----------|
 *  | addition       | 2 + 2     | 4        |
 *  | subtraction    | 2 - 2     | 0        |
 *  | multiplication | 2 * 2     | 4        |
 *  | division       | 2 / 2     | 1        |
 * }
 * 
 * const res = mdTableToJson(table);
 * main();
 * @throws {Error}
 * @returns {Promise<>}
 */
 const mdTableToJson = (markdownInput) => {
   let markdown = markdownInput.replace(/\n\s+/g, '\n'); // remove indentation
   markdown = markdown.replace(/\/\/.*\n/g, ''); // remove commented out lines
 
   const parsedTable = marked.lexer(markdown).find((e) => e.type === 'table');
   return parsedTable.rows.map((cell) => {
     const obj = {};
     for (let i = 0; i < parsedTable.header.length; i += 1) {
       obj[parsedTable.header[i].text] = cell[i].text;
     }
     return obj;
   });
 };
 
 module.exports = {
   mdTableToJson,
 };