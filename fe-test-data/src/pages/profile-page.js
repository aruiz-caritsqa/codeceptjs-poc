const Page = require('../page');

let self;
let I;

class ProfilePage extends Page {
  // searchBox
  // userName-value
  // gotoStore

  constructor() {
    super();
    self = this;
    ({ I } = self);
  }

  async checkUrl() {
    super.checkUrl('/profile');
  }

  gotoUrl() {
    super.gotoUrl(`${global.TEST_URL}/profile`);
  }

  bookCollectionRows() {
    return '//div[@class="profile-wrapper"]//div[contains(@class, "ReactTable")]//div[@role="row" and .//img]';
  }

  logoutButton() {
    return '//button[text() = "Log out"]';
  }

  deleteAccountButton() {
    return '//button[text() = "Delete Account"]';
  }

  deleteAllBooksButton() {
    return '//button[text() = "Delete All Books"]';
  }
}

module.exports = new ProfilePage();
module.exports.ProfilePage = ProfilePage;
