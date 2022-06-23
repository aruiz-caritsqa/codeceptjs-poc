/* eslint-disable no-restricted-syntax */
const dotenv = require('dotenv');
const crypt = require('./src/helpers/crypt');

const env = process.env.TEST_ENV || 'prod';
global.TEST_ENV = env;
const envvars = dotenv.config({ path: `${__dirname}/${env}.env` });

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiSubset = require('chai-subset');
const chaiMatchPattern = require('chai-match-pattern');

// https://www.chaijs.com/plugins/chai-match-pattern/
// -> https://github.com/mjhm/lodash-match-pattern
// --> https://github.com/mjhm/lodash-match-pattern/blob/master/MATCHERS_AND_FILTERS.md#complete-list-of-lodash-match-pattern-matching-functions-and-added-filters
chai.use(chaiMatchPattern);
chai.use(chaiAsPromised);
chai.use(chaiSubset);
const { expect } = chai;
global.expect = expect;

global.cmp = chaiMatchPattern.getLodashModule();

for (const [key, val] of Object.entries(envvars.parsed)) {
  let envvar;
  try {
    envvar = crypt.decrypt(val);
  } catch (e) {
    envvar = val;
  } finally {
    global[key] = envvar;
  }
}

const accountApiWrapper = require('./src/api-wrappers/account');
const bookstoreApiWrapper = require('./src/api-wrappers/bookstore');
const mdTableToJson = require('./src/helpers/mdtable-to-json');
const pause = require('./src/helpers/pause');
const request = require('./src/helpers/requester');
const currency = require('./src/helpers/currency');
const pdfReader = require('./src/helpers/pdf-reader');
const graphql = require('./src/helpers/query-graphql');
const regexEscape = require('./src/helpers/regex-escape');
const userInbox = require('./src/helpers/user-inbox');

module.exports = {
  ...accountApiWrapper,
  ...bookstoreApiWrapper,

  ...crypt,
  ...mdTableToJson,
  ...pause,
  ...request,
  ...currency,
  ...pdfReader,
  ...graphql,
  ...regexEscape,
  ...userInbox,
};
