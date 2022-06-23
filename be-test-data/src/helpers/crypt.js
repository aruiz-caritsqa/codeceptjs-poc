const crypto = require('crypto');

/**
 * Encrypts an normal text string
 * @param {String} text - The string to encrypt
 * @param {String} key - Specify a key to use for encryption
 * @example
 * const { encrypt } = require('be-test-data');
 * const encryptedVal = encrypt('hello world');
 * @example
 * const { encrypt } = require('be-test-data');
 * // Specify a key that will be needed for the decryption
 * const encryptedVal = encrypt('hello world', 'Mundo');
 * @returns {String} The encrypted String
 */
function encrypt(text, key = process.env.KEY || 'Finance') {
  const cipher = crypto.createCipher('aes-128-cbc', key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

/**
 * Decrypts an encrypted string
 * @param {String} text - The string to decrypt
 * @param {String} key - Specify a key to use for decryption
 * @example
 * const { decrypt } = require('be-test-data');
 * const decryptedVal = decrypt('e8d893ebdacdda1e27cfa4c615219e52');
 * @returns {String} The decrypted String
 */
const decrypt = (text, key = process.env.KEY || 'Finance') => {
  const decipher = crypto.createDecipher('aes-128-cbc', key);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

function sha1(input) {
  return crypto.createHash('sha1').update(input).digest('hex');
}

module.exports = {
  sha1,
  encrypt,
  decrypt,
};
