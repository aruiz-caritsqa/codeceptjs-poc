Feature('Login Test');
const { 
  createUserAccount,
  generateToken,
  deleteUserAccount,
 } = require('be-test-data');

Scenario('Failed login test', async ({ I, LoginPage }) => {
  await LoginPage.loginToBookstore('failedUserName', 'failedPassword');
  await I.addScreenshotToAllure();
  
  I.seeElement(LoginPage.output());
  await I.analyzeAccessibility('Login page after failure');

  const errorMessage = await I.getElement(LoginPage.output());
  const text = await I.getTextFromElement(errorMessage)
  const attributes = await I.getAttributesFromElement(errorMessage)
  const id = await I.getAttributeFromElement(errorMessage, 'id');
  global.expect(text).to.equal('Invalid username or password!');
});

Scenario('Successful login test with user created via API', async ({ I }) => {
  const usernamePassword = 'Testing123454321!'
  const { userID } = await createUserAccount({ userName: usernamePassword, password: usernamePassword});
  await I.addLogMessageToAllure(`userID: ${JSON.stringify(userID, null, 2)}`);

  // cleanup
  const { token } = await generateToken({ userName: usernamePassword, password: usernamePassword});
  const res = await deleteUserAccount({ userID, token, isRaw: true });
  global.expect(res.statusCode).to.equal(204)  
})