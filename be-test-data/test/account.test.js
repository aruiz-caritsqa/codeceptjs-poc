const {
  createUserAccount,
  deleteUserAccount,
  getUserAccount,
  generateToken,
  isAuthorized,
} = require('../src/api-wrappers/account');

const { mdTableToJson } = require('../src/helpers/mdtable-to-json');
const evaluate = (_s) => { let s = _s; try { s = eval(`\`${s}\``); s = eval(s); } catch (e) { return s; } return s; };

Feature('User Account Endpoints @account')//.config('Puppeteer', {restart: false }); // https://codecept.io/advanced/#dynamic-configuration;
let userID;
let token;

const usernamePassword = 'Testing1212!';

Scenario('Create new user via API; Should authorize successfully; Should get token; Should find user via API', async ({ I }) => {
  __`Given I create a new User Account`;
  ({ userID } = await createUserAccount({ userName: usernamePassword, password: usernamePassword}));
  await I.addLogMessageToAllure(`userID: ${JSON.stringify(userID, null, 2)}`);

  await I.wait(1);  

  __`Then I generate a User Token`;
  ({ token } = await generateToken({ userName: usernamePassword, password: usernamePassword}));
  await I.addLogMessageToAllure(`token: ${JSON.stringify(token, null, 2)}`);  

  const user = await getUserAccount({ token, userID });
  await I.addLogMessageToAllure(`user: ${JSON.stringify(user, null, 2)}`);

  await I.localMessageToAllureFunction('foo to the bar')
});

Data(mdTableToJson(`
  | desc                                                               | getUserAccountInput        | expStatusCode | expMsg                                                          |
  |--------------------------------------------------------------------|----------------------------|---------------|-----------------------------------------------------------------|
  | Successful Authorization - uses computed variables (userID, token) | ({userID, token})          | 200           | ({"userId": userID, "username": usernamePassword, "books": []}) |
  | Fail - invalid userID                                              | ({userID: 'me', token})    | 401           | ({"code": "1207", "message": "User not found!"})                |
  | Fail - invalid token                                               | ({userID, token: 'token'}) | 401           | ({"code": "1200", "message": "User not authorized!"})           |
  | Fail - missing userID                                              | ({token})                  | 401           | ({"code": "1207", "message": "User not found!"})                |
  | Fail - missing token                                               | ({userID})                 | 401           | ({"code": "1200", "message": "User not authorized!"})           |
`)).Scenario('getUserAccount Data Driven Test', async ({ I, current }) => {
  const getUserAccountInput = evaluate(current.getUserAccountInput);
  const expStatusCode = evaluate(current.expStatusCode);
  const expMsg = evaluate(current.expMsg);
  I.addLogMessageToAllure(getUserAccountInput, 'input');
  const res = await getUserAccount({ ...getUserAccountInput, ...{ isRaw: true} });
  I.addLogMessageToAllure({ statusCode: res.statusCode, body: res.body }, 'output');
  
  global.expect(res.statusCode).to.equal(expStatusCode);
  global.expect(res.body).to.matchPattern(expMsg);
})

Scenario('Login with user created by API', async ({ I, LoginPage }) => {
  await LoginPage.loginToBookstore(usernamePassword, usernamePassword);  
  await I.wait(1);
  
  I.amOnPage(`${global.TEST_URL}/profile`);
  I.seeElement('//div[@id="books-wrapper"]');
  await I.addScreenshotToAllure();
});

Data(mdTableToJson(`
  | desc                                                                | isAuthorizedInput                                          | expStatusCode | expMsg                                                           |
  |---------------------------------------------------------------------|------------------------------------------------------------|---------------|------------------------------------------------------------------|
  | Successful Authorization - uses defined variable (usernamePassword) | ({userName: usernamePassword, password: usernamePassword}) | 200           | true                                                             |
  | Fail - incorrect userName                                           | ({userName: 'foo', password: usernamePassword})            | 404           | ({"code": "1207", "message": "User not found!"})                 |
  | Fail - incorrect password                                           | ({userName: usernamePassword, password: 'foo'})            | 404           | ({"code": "1207", "message": "User not found!"})                 |
  | Fail - missing password                                             | ({userName: usernamePassword})                             | 400           | ({"code": "1200", "message": "UserName and Password required."}) |
  | Fail - missing userName                                             | ({password: usernamePassword})                             | 400           | ({"code": "1200", "message": "UserName and Password required."}) |
`)).Scenario('isAuthorized Data Driven Test', async ({ I, current }) => {
  const isAuthorizedInput = evaluate(current.isAuthorizedInput);
  const expStatusCode = evaluate(current.expStatusCode);
  const expMsg = evaluate(current.expMsg);
  I.addLogMessageToAllure(isAuthorizedInput, 'input');
  const res = await isAuthorized({ ...isAuthorizedInput, ...{ isRaw: true} });
  I.addLogMessageToAllure({ statusCode: res.statusCode, body: res.body }, 'output');
  
  global.expect(res.statusCode).to.equal(expStatusCode);
  global.expect(res.body).to.matchPattern(expMsg);
})


// https://www.chaijs.com/plugins/chai-match-pattern/
// -> https://github.com/mjhm/lodash-match-pattern
// --> https://github.com/mjhm/lodash-match-pattern/blob/master/MATCHERS_AND_FILTERS.md#complete-list-of-lodash-match-pattern-matching-functions-and-added-filters
Data(mdTableToJson(`
  | desc                                                                         | generateTokenInput                                         | expStatusCode | expMsg                                                                                                                                                                     |
  |------------------------------------------------------------------------------|------------------------------------------------------------|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
  | Successful Authorization - uses chai-match-pattern to validate response body | ({userName: usernamePassword, password: usernamePassword}) | 200           | ({"token": /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, "expires": global.cmp.isDateString, "status": "Success", "result": "User authorized successfully."}) |
  | Fail - incorrect userName                                                    | ({userName: 'foo', password: usernamePassword})            | 200           | ({"token": null, "expires": null, "status": "Failed", "result": "User authorization failed."})                                                                             |
  | Fail - incorrect password                                                    | ({userName: usernamePassword, password: 'foo'})            | 200           | ({"token": null, "expires": null, "status": "Failed", "result": "User authorization failed."})                                                                             |
  | Fail - missing password                                                      | ({userName: usernamePassword})                             | 400           | ({"code": "1200", "message": "UserName and Password required."})                                                                                                           |
  | Fail - missing userName                                                      | ({password: usernamePassword})                             | 400           | ({"code": "1200", "message": "UserName and Password required."})                                                                                                           |
`)).Scenario('generateToken Data Driven Test', async ({ I, current }) => {
  const generateTokenInput = evaluate(current.generateTokenInput);
  const expStatusCode = evaluate(current.expStatusCode);
  const expMsg = evaluate(current.expMsg);
  I.addLogMessageToAllure(generateTokenInput, 'input');
  const res = await generateToken({ ...generateTokenInput, ...{ isRaw: true} });
  I.addLogMessageToAllure({ statusCode: res.statusCode, body: res.body }, 'output');
  
  global.expect(res.statusCode).to.equal(expStatusCode);
  global.expect(res.body).to.matchPattern(expMsg);
});

Scenario('Should Delete User', async ({ I }) => {
  let user;

  ({ token } = await generateToken({ userName: usernamePassword, password: usernamePassword}));
  user = await getUserAccount({ token, userID });
  I.addLogMessageToAllure(`user: ${JSON.stringify(user, null, 2)}`);

  const res = await deleteUserAccount({ userID, token, isRaw: true });
  global.expect(res.statusCode).to.equal(204)

  await global.expect(getUserAccount({ token, userID })).to.eventually.be.rejectedWith('401');
})

Scenario('Shouldn\'t successfully Login with user that has just been deleted', async ({ I, LoginPage }) => {
  await LoginPage.loginToBookstore(usernamePassword, usernamePassword);
  debugger;
  I.seeElement(LoginPage.output());
})