/**
 * Converts a prettified currency string into a Number
 * @param {String} input
 * @example
 * const { parseCurrency } = require('be-test-data');
 * const val = parseCurrency('$8,000.76');
 * @throws {Error} If the passed input is not a String
 * @throws {Error} If input is not a valid monetary amount
 * @returns {Number} The monetary amount converted to a Float
 */
const parseCurrency = (input) => {
  if (typeof input === 'number') {
    return input;
  }

  if (typeof input !== 'string') {
    throw new Error(`Cannot convert ${JSON.stringify(input)}`);
  }

  let amount;
  try {
    amount = input.match(/([\d.-])/g).join('');
  } catch (e) {
    throw new Error(`'${input}' is not a valid monetary amount`);
  }
  return parseFloat(parseFloat(amount, 10).toFixed(2), 10);
};

/**
 * Convert an amount to prettified GBP amount
 * If an integer is the input, then a currency value without decimals '.00' is returned
 * If a float is the input, a currency value with maximum 2 decimal places is returned
 * @param {Number} input
 * @param {Object} options
 * @param {String} currency - default: "GBP"
 * @param {NUmber} minimumFractionDigits - default: 0
 * @example
 * const { prettifyCurrency } = require('be-test-data');
 * const numAsCurrency = prettifyCurrency(8098.45);
 * // => £8,098.45
 * @returns {String} prettified GBP amount
 */
const prettifyCurrency = (
  input,
  options = {},
) => {
  const currency = options.currency || 'GBP';
  const minimumFractionDigits = options.minimumFractionDigits || 0;

  return input.toLocaleString('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits: 2,
  });
};

module.exports = {
  parseCurrency,
  prettifyCurrency,
};
