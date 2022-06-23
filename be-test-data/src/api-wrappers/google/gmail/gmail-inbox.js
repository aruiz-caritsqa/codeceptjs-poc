const fs = require('fs-extra');
const gmail = require('gmail-tester');
const moment = require('moment');

/**
 * Returns a list of *credentials.json and *token.json files required to get emails from the GMail API
 * @param {String} name
 * @example
 * const { filterGmailAccessFiles } = require('be-test-data');
 * const main = async () => {
 *   const credentialsAndTokenFiles = filterGmailAccessFiles(email);
 *   console.log(credentialsAndTokenFiles);
 * }
 * main();
 * @returns {Array<String>} An array containing the *credentials.json and *-token.json files
 */
const filterGmailAccessFiles = (name) => {
  const res = fs
    .readdirSync(`${__dirname}/access-files`)
    .map((f) => (f.match(new RegExp(name, 'i')) ? `${__dirname}/access-files/${f}` : null))
    .filter((x) => x);
  return res;
};

/**
 * Gmail Email Object
 * @typedef GmailEmailObject
 * @property {String} from
 * @property {String} subject
 * @property {Timestamp} date
 * @property {Object} body
 * @property {String} body.html
 * @property {String} body.text
 */

/**
 * Returns email messages from the GMail account specified
 * @param {String} email - The email inbox to read from
 * @param {Object} options
 * @param {String} options.email - The email inbox to read from
 * @param {Object} options.subject - The email subject
 * @param {Object} options.maxWait - Max time to wait in seconds
 * @todo remove the email argument so the function uses only destructed parameters
 * @example
 * const { getGmailMessage } = require('be-test-data');
 * const main = async () => {
 *   const email = getGmailMessage(
 *    customerEmail,
 *    { subject: 'Welcome' }
 *   );
 * }
 * main();
 * @throws {Error} Throws an error if no email was returned
 * @returns {GmailEmailObject}
 */
const getGmailMessage = async (
  email,
  options = {
    // email,
    // subject,
    // maxWait,
  },
) => {
  let genericLocalPart;
  const emailAddress = email || options.email;
  let maxWaitSec = options.maxWait || 90;
  if (maxWaitSec > 1000) {
    if ((maxWaitSec / 10000) > 90) {
      maxWaitSec = 90;
    } else {
      maxWaitSec = parseInt(maxWaitSec / 1000, 10);
    }
  } else if (maxWaitSec > 90) {
    maxWaitSec = 90;
  }

  try {
    // eslint-disable-next-line no-undef
    [, genericLocalPart] = emailAddress.match(/([a-zA-Z0-9._]+).*(\+([0-9-_a-z]+))?@gmail.com/);
  } catch (e) {
    throw new Error(`${JSON.stringify(emailAddress)} is not in the format <name>+<timestamp><_update?>@gmail.com`);
  }

  const gmailApiAccessFiles = filterGmailAccessFiles(genericLocalPart);
  if (gmailApiAccessFiles.length !== 2) {
    throw new Error(`There are ${gmailApiAccessFiles.length} files returned for ${emailAddress}: ${JSON.stringify(gmailApiAccessFiles)}. Cannot access Inbox`);
  }

  const mail = await gmail.check_inbox(
    ...gmailApiAccessFiles,
    {
      to: emailAddress,
      subject: options.subject,
      include_body: true,
      wait_time_sec: 1,
      max_wait_time_sec: maxWaitSec,
      ...options,
    },
  );
  expect(mail, `No email found for ${emailAddress} with subject '${options.subject}' after ${maxWaitSec}s at ${moment().format('DD-MM-YYYY HH:mm:ss')}`).not.to.be.undefined;
  return mail;
};

module.exports = {
  filterGmailAccessFiles,
  getGmailMessage,
};
