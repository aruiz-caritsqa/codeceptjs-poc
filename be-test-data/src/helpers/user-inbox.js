const { getGmailMessage } = require('../api-wrappers/google/gmail/gmail-inbox');

/**
 * Returns an email sent to a specific customer; Can read Gmail
 * @param {Object} param0
 * @param {String} param0.customerId
 * @example
 * const { getCustomerEmail } = require('be-test-data');
 * const main = async () => {
 *  const email = await getCustomerEmail(
 *  'poctestcodecept@gmail.com', { 
 *    subject: 'Codecept, finish setting up your new Google Account' 
 *   })
 * }
 * main();
 * @throws {Error}
 * @returns {Promise<>}
 */
const getCustomerEmail = async (
  email,
  options = {
    subject: 'Welcome',
    to: email,
  },
) => {
  let res;
  if (/@gmail.com$/.test(email)) {
    res = await getGmailMessage(email, options);
  } else if(/@outlook.com$/.test(email)) {
    //...
  }

  return res;
};

module.exports = {
  getCustomerEmail,
};
