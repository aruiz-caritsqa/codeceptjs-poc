const { MethodMissingClass } = require('unmiss');

let self;
let I;

class Page extends MethodMissingClass {
  constructor() {
    super();
    self = this;

    try {
      // needed for fe-test-data
      ({ I } = inject())
    } catch (e) {
      // needed for be-test-data, fe-test-suite
      I = global.codeceptjs.actor();
    }   
    self.I = I; 
  }

  async checkUrl(path) {
    let url;
    for (let i = 1; i < 30; i += 1) {
      console.log(`=> checkUrl: ${path}`);
      url = await I.grabCurrentUrl();
      if (new RegExp(path).test(url)) {
        break;
      }
      this.wait(1);
    }

    if (!new RegExp(path).test(url)) {
      throw new Error(`checkUrl :: current URL '${url}' doesn't match '${path}'`);
    }
    return true;
  }

  async gotoUrl(path) {
    await self.I.amOnPage(path);
  }

  methodMissing(name, ...args) {
    if (name === 'toJSON') {
      return;
    }

    console.log(`Method ${name} was called with arguments:`, JSON.stringify(args));
    const xpathSearch = global.attributeHooks.map((hook) => `@${hook}="${name}"`).join(' or ');
    console.log(`//*[${xpathSearch}]`);
    return `//*[${xpathSearch}]`;
  }
}
module.exports = Page;