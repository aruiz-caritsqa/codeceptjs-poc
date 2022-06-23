const Page = require('../page');

let self;
let I;

class RegisterPage extends Page {
  constructor() {
    super();
    self = this;
    ({ I } = self);
  }

  async checkUrl() {
    await super.checkUrl('register');
  }

  gotoUrl() {
    super.gotoUrl(`${global.TEST_URL}/register`)
  }

  captchaAnchor() {
    return '//*[@id="recaptcha-checkbox-border"]'
  }

  async loginToBookstore(userName, password) {
    self.gotoUrl();
    I.fillField(self.userName(), userName);
    I.fillField(self.password(), password);
    I.click(self.login());
    await I.wait(2);
  }
}

module.exports = new RegisterPage();
module.exports.RegisterPage = RegisterPage;