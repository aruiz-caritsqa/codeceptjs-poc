/**
 * Checks if a regex pattern (needle) exists in a string (haystack) with or without the regex (needle) using escaped characters
 * @param {String} haystack the content
 * @param {String} needle the regex
 * @example
 * const { isRegexpMatchWithOrWithoutEscapingNeedle } = require('be-test-data');
 * const main = async () => {
 *   const haystack = 'Hi there!\n\nThis purchase is $2.34'
 *   isRegexpMatchWithOrWithoutEscapingNeedle(s, 'Hi there!\n\nThis purchase is $2.34') // true
 *   isRegexpMatchWithOrWithoutEscapingNeedle(s, 'Hi there!\n\nThis purchase is $[0-9.]+') // false  
 *   isRegexpMatchWithOrWithoutEscapingNeedle(s, 'Hi there!\n\nThis purchase is \\$[0-9.]+') // true
 *   isRegexpMatchWithOrWithoutEscapingNeedle(s, 'Hi there!\\\n\nThis purchase is \\$[0-9.]+') // true
 * }
 * main();
 * @returns {Boolean}
 */
const isRegexpMatchWithOrWithoutEscapingNeedle = (haystack, needle) => new RegExp(needle).test(haystack) || new RegExp(needle.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')).test(haystack);

module.exports = {
  isRegexpMatchWithOrWithoutEscapingNeedle,
};
