const { pages: { LoginPage, RegisterPage, ProfilePage }} = require('fe-test-data');

Feature('Register new user @register')

const userNamePassword = 'Testing1234321!';

Scenario('Signup via UI', async ({ I }) => {
  LoginPage.gotoUrl();
  await I.analyzeAccessibility('Login page');
  I.click(LoginPage.newUser())

  await RegisterPage.checkUrl();
  await I.analyzeAccessibility('Register page');
  I.fillField(RegisterPage.firstname(), userNamePassword);
  I.fillField(RegisterPage.lastname(), userNamePassword);
  I.fillField(RegisterPage.userName(), userNamePassword);
  I.fillField(RegisterPage.password(), userNamePassword);

  I.switchTo(`//iframe[starts-with(@name, 'a-') and starts-with(@src, 'https://www.google.com/recaptcha')]`);
  I.waitForElement('div.recaptcha-checkbox-checkmark')
  I.click('div.recaptcha-checkbox-checkmark');  
  I.switchTo();

  // time to solve the image captcha manually
  await I.wait(20);

  I.click(RegisterPage.register())
  await I.wait(5);
  I.acceptPopup();
});

Scenario('Login via the UI; Delete Account', async ({ I }) => {
  await LoginPage.loginToBookstore(userNamePassword, userNamePassword);
  await ProfilePage.checkUrl();
  await I.analyzeAccessibility('Profile page');

  I.scrollTo(ProfilePage.deleteAccountButton())
  I.click(ProfilePage.deleteAccountButton())
  I.click(ProfilePage['closeSmallModal-ok']())
  await I.wait(5);
  I.acceptPopup();
  await LoginPage.checkUrl();
});




