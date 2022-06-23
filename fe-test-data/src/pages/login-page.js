const Page = require(`../page`);

let self;
let I;
class LoginPage extends Page {
  constructor() {
    super();
    self = this;
    ({ I } = self);
  }

  async checkUrl() {
    super.checkUrl('/login');
  }

  gotoUrl() {
    super.gotoUrl(`${global.TEST_URL}/login`)
  }

  async loginToBookstore(userName, password) {
    self.gotoUrl();
    I.fillField(self.userName(), userName);
    I.fillField(self.password(), password);
    I.click(self.login());
    await I.wait(2);
  }
}

module.exports = new LoginPage();
module.exports.LoginPage = LoginPage;