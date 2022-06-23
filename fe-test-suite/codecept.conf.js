require('be-test-data');
const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');
const { fork, execSync, exec, spawn } = require('child_process');
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const fs = require('fs');

// global.attributeHooks = ['id'];

let browser = process.env.BROWSER?.toLowerCase() || 'puppeteer';
global.expect(browser).to.be.oneOf(['puppeteer', 'chrome', 'safari', 'firefox'])
const isHeadless = !!process.env.HEADLESS;

const wdioDriverServices = {
  chrome: 'chromedriver',
  firefox: 'geckodriver',
  safari: 'safaridriver',
};

console.log(`=> url: ${global.TEST_URL}`)
console.log(`=> browser: ${browser}`)
console.log(`=> isHeadless: ${isHeadless}`)

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run

setHeadlessWhen(isHeadless);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

const isWdioBrowser = (browser) => Object.keys(wdioDriverServices).includes(browser);

exports.config = {
  tests: 'test/*.test.js',
  output: './allure-results',
  helper: isWdioBrowser(browser) ? 'WebDriver' : 'Puppeteer',
  helpers: {
    ...(!isWdioBrowser(browser) && { 
      Puppeteer: {
        url: global.TEST_URL,
        windowSize: '1200x900',
        show: true,
        chrome: {
          args: []
        }
      }
    }),
    ...(isWdioBrowser(browser) && {
      WebDriver: {
        url: global.TEST_URL,
        browser,
        show: true,
        path: browser === 'chrome' ? '' : '/',
        windowSize: '1200x900',
        logLevel: 'info',
        seleniumArgs: [],
      }  
    })
  },
  plugins: {
    ...(isWdioBrowser(browser) && {
      wdio: {
        enabled: true,
        services: [wdioDriverServices[browser]],
      }
    }),
    allure: {
      enabled: true,
    },
  },
  include: {
    I: './steps_file.js',
  },
  bootstrap: null,
  name: 'fe-test-data',


  async bootstrap() {
    try {
      fs.rmdirSync('allure-report', { recursive: true, force: true })
    } catch(e) {
      console.log(`failed to delete allure-report`)
    }

    try {
      fs.rmdirSync('allure-results', { recursive: true, force: true })
    } catch(e) {
      console.log(`failed to delete allure-results`)
    }

    try {
      fs.rmdirSync('non-functional-reports', { recursive: true, force: true })
    } catch(e) {
      console.log(`failed to delete non-functional-reports`)
    }    

    try {
      fs.mkdirSync('allure-report');
    } catch(e) {
      console.log(`failed to create allure-report`)
    }

    try {
      fs.mkdirSync('allure-results');
    } catch(e) {
      console.log(`failed to create allure-results`)
    }   
    
    if (browser === 'firefox') {
      console.log('Do some pretty suite setup stuff');
      fork('./node_modules/.bin/geckodriver');
      await pause(2000)
    }
  },

  async teardown() {
    if (browser === 'firefox') {
      console.log('All workers have finished running tests so we should clean up the temp folder');
      execSync('pkill -9 geckodriver')  
    }
  },  
}