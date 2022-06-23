const LoginPage = require('../src/pages/login-page');

Feature('Login Page');

Scenario('Failed login', async ({ I }) => {
  __`When I fail to login to the Bookstore`;
  await LoginPage.loginToBookstore('failedUserName', 'failedPassword');
  await I.addScreenshotToAllure();
  await I.checkImage('failed-login.png');

  __`Then I should see the Error message`;
  I.seeElement('$output');
  const errorMessage = await I.getElement(LoginPage.output());
  const text = await I.getTextFromElement(errorMessage);
  I.expect(text).to.equal('Invalid username or password!');

  __`And I display the error message's attribures`;
  const attributes = await I.getAttributesFromElement(errorMessage);
  I.say(`attributes: ${JSON.stringify(attributes)}`);
  const id = await I.getAttributeFromElement(errorMessage, 'id');
  I.say(`id: ${id}`);
});
