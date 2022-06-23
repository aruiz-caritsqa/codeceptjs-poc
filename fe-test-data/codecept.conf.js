require('be-test-data');
const { combineAllure } = require('allure-single-html-file-js');
const { setCommonPlugins } = require('@codeceptjs/configure');
const { execSync } = require('child_process');
const fs = require('fs');

global.attributeHooks = ['id'];

const wdioBrowsers = [
  'chrome',
  'firefox',
  'safari',
  'MicrosoftEdge',
];

const playwrightBrowsers = [
  'chromium',
  'webkit',
];

const browserSize = () => {
  switch (process.env.SIZE) {
    case 'xSmall':
      return { w: 320, h: 568 };
    case 'small':
      return { w: 375, h: 812 };
    case 'medium':
      return { w: 768, h: 1024 };
    case 'large':
      return { w: 1440, h: 900 };
    case 'xLarge':
      return { w: 1920, h: 1080 };
    case 'xxLarge':
      return { w: 3840, h: 2160 };
    default:
      return { w: 1440, h: 900 };
  }
};

const browser = process.env.BROWSER || 'puppeteer';
if (process.env.BROWSER && ![...wdioBrowsers, ...playwrightBrowsers].includes(browser)) {
  throw new Error(`BROWSER needs to be one of ${JSON.stringify([...wdioBrowsers, ...playwrightBrowsers])}`);
}
const isHeadless = !!process.env.HEADLESS;

console.log(`=> url: ${global.TEST_URL}`);
console.log(`=> browser: ${browser}`);
console.log(`=> isHeadless: ${isHeadless}`);
console.log(`=> size: ${JSON.stringify(browserSize())}`);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

const frameworkType = (browserName) => {
  if (wdioBrowsers.includes(browserName)) {
    return 'wdio';
  } if (playwrightBrowsers.includes(browserName)) {
    return 'playwright';
  }
  return 'puppeteer';
};

exports.config = {
  tests: `${process.cwd()}/test/*.test.js`,
  output: `${process.cwd()}/allure-results`,
  helpers: {
    ...(frameworkType(browser) === 'puppeteer' && {
      Puppeteer: {
        url: global.TEST_URL,
        windowSize: `${browserSize().w}x${browserSize().h}`,
        show: !isHeadless,
        chrome: {
          args: [],
        },
      },
    }),
    ...(frameworkType(browser) === 'wdio' && {
      WebDriver: {
        url: global.TEST_URL,
        browser,
        show: true,
        path: '/',
        host: 'localhost',
        windowSize: `${browserSize().w}x${browserSize().h}`,
        logLevel: 'info',
        seleniumArgs: {
        },
        desiredCapabilities: {
          ...(browser === 'firefox' && {
            'moz:firefoxOptions': {
              args: [
                ...(isHeadless ? ['--headless'] : []),
                `--width=${browserSize().h}`,
                `--height=${browserSize().h}`,
              ],
            },
          }),
          ...(browser === 'MicrosoftEdge' && {
            'ms:edgeOptions': {
              args: [
                ...(isHeadless ? ['-headless'] : []),
              ],
            },
          }),
          ...(browser === 'chrome' && {
            'goog:chromeOptions': {
              args: [
                '--incognito',
                ...(isHeadless ? [
                  '--headless',
                  '--disable-gpu',
                  '--no-sandbox',
                ] : []),
                ...(['xSmall', 'small', 'medium'].includes(process.env.SIZE) ? [
                  '--user-agent="Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36"',
                ] : []),
              ],
            },
          }),
        },
      },
    }),
    ...(frameworkType(browser) === 'playwright' && {
      Playwright: {
        url: global.TEST_URL,
        browser,
        show: !isHeadless,
        windowSize: `${browserSize().w}x${browserSize().h}`,
        logLevel: 'debug',
      },
    }),
    PixelmatchHelper: {
      require: 'codeceptjs-pixelmatchhelper',
      dirExpected: './visreg/screenshots/expected/',
      dirDiff: './visreg/screenshots/diff/',
      dirActual: './visreg/screenshots/actual/',
      diffPrefix: 'Diff_',
      tolerance: 0,
      threshold: 0.05,
      dumpIntermediateImage: false,
      captureActual: false,
      captureExpected: false,
    },
  },
  plugins: {
    commentStep: {
      enabled: true,
      registerGlobal: true,
    },
    customLocator: {
      enabled: true,
      attribute: 'id',
      prefix: '$',
    },
    ...(frameworkType(browser) === 'wdio' && {
      wdio: {
        enabled: true,
        services: ['selenium-standalone'],
      },
    }),
    allure: {
      enabled: true,
    },
  },
  include: {
    I: `${process.cwd()}/steps_file.js`,
    LoginPage: './src/pages/login-page.js',
    ProfilePage: './src/pages/profile-page.js',
    ResisterPage: './src/pages/register-page.js',
  },
  name: 'fe-test-data',

  async bootstrapAll() {
    [
      `${process.cwd()}/allure-report`,
      `${process.cwd()}/allure-results`,
      `${process.cwd()}/non-functional-reports`,
      `${process.cwd()}/visreg/screenshots/actual`,
      `${process.cwd()}/visreg/screenshots/diff`,
    ].forEach((dir) => {
      try {
        fs.rmdirSync(dir, { recursive: true, force: true });
      } catch (e) {
        console.log(`failed to delete ${dir}: ${e}`);
      }
    });

    [
      `${process.cwd()}/allure-report`,
      `${process.cwd()}/allure-results`,
      `${process.cwd()}/visreg/screenshots/actual`,
    ].forEach((dir) => {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (e) {
        console.log(`failed to create ${dir}: ${e}`);
      }
    });
  },

  async teardownAll() {
    execSync('./node_modules/.bin/allure generate');
    combineAllure(`${process.cwd()}/allure-report`);
  },
};
