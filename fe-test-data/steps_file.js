// in this file you can append custom step methods to 'I' object
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const moment = require('moment');
const axeReport = require('axe-html-reporter');
const AxeBuilder = require('@axe-core/webdriverio').default;

global.allure = global.codeceptjs?.container?.plugins('allure');

module.exports = function () {
  return actor({
    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.
    expect(...args) {
      this.wait(0);
      return global.expect(...args);
    },

    async addLogMessageToAllure(content, title = 'Log Message') {
      global.allure.addAttachment(
        title,
        content.constructor.name === 'String' ? content : JSON.stringify(content, null, 2),
        'application/json',
      );
    },

    async checkImage(name) {
      if (!/\.png/i.test(name)) {
        throw new Error('checkImage :: image name must end in ".png"');
      }

      const outputDir = global.codeceptjs.container.helpers().PixelmatchHelper.config.dirActual || global.codeceptjs.config.get('output');
      const baseDir = global.codeceptjs.container.helpers().PixelmatchHelper.config.dirExpected;
      await this.saveScreenshot(path.join(outputDir, name), true);

      const baseImage = await Jimp.read(path.join(baseDir, name));
      await Jimp.read(path.join(outputDir, name))
        .then((image) => image
          .contain(
            baseImage.bitmap.width,
            baseImage.bitmap.height,
            // eslint-disable-next-line no-bitwise
            Jimp.HORIZONTAL_ALIGN_LEFT | Jimp.VERTICAL_ALIGN_TOP,
          )
          .writeAsync(path.join(outputDir, name)))
        .catch((err) => {
          console.error(err);
        });

      const res = await this.getVisualDifferences(name);
      if (res.match) {
        // Identical enough. Difference is 0%
        this.say(`Identical enough. Difference is ${res.difference}%`);
      } else {
        // Too different. Difference is 1.2345% - review Diff_dashboard.png for details!
        this.say(`Too different. Difference is ${res.difference}% - review ${res.diffImage} for details!`);
      }
    },

    async addScreenshotToAllure() {
      const imgUuid = `${uuid()}.png`;
      await this.saveScreenshot(imgUuid, true);
      try {
        const cwd = process.cwd();
        const filePathAttachment = path.join(cwd, './allure-results', imgUuid);
        console.log(`=> addAllureAttachment: ${filePathAttachment}`);
        const bufferData = fs.readFileSync(filePathAttachment);
        // console.log(bufferData.length);
        allure.addAttachment(imgUuid, bufferData, 'image/png');
      } catch (e) {
        console.log('Error in adding allure attachment');
        console.log('Error:', e.stack);
      }
    },

    // Analyze accessibility with webdriverIO usage and CodeceptJS
    // lease notice this is not configured to be used with Puppeteer
    async analyzeAccessibility(scenarioName) {
      const helper = global.codeceptjs.container.helpers('WebDriver');

      // analyzeAccessibility should only work with wdio and chrome/firefox/safari/edge
      // its useless running on chromium/webkit
      if (helper !== undefined) {
        try {
          const rawAxeResults = await new AxeBuilder({ client: helper.browser }).analyze();
          axeReport.createHtmlReport({
            results: rawAxeResults,
            projectKey: 'CodeceptJS POC',
            options: {
              outputDir: 'non-functional-reports/accessibility',
              reportFileName: `${scenarioName}-${moment().format('YYYY-MM-DD')}-accessibility-report.html`,
            },
          });
        } catch (e) {
          console.error(e);
        }
      }
    },

    async getElements(xpath) {
      await this.wait(0);
      const helper = Object.entries(global.codeceptjs.container.helpers())[0][1];
      const elements = await helper._locate(xpath);
      return elements;
    },
    async getElement(xpath) {
      await this.wait(0);
      const [element] = await this.getElements(xpath);
      return element;
    },
    async getTextFromElement(element) {
      const text = await this.executeScript((el) => el.textContent, element);
      return text;
    },
    async getAttributesFromElement(element) {
      const attributes = await this.executeScript((el) => el.getAttributeNames()
        .reduce((obj, name) => ({
          ...obj,
          [name]: el.getAttribute(name),
        }), {}), element);
      return attributes;
    },
    async getAttributeFromElement(element, attributeName) {
      const attribute = await this.executeScript((el, name) => el.getAttribute(name), element, attributeName);
      return attribute;
    },
  });
};
