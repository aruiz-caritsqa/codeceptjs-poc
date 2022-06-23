const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');
console.log(`=> url: ${global.TEST_URL}`)

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

exports.config = {
  tests: './test/*.test.js',
  output: './allure-results',
  helpers: {
    WebDriver: {
      url: global.TEST_URL,
      browser: 'iPhone',
      path: '/wd/hub',
      desiredCapabilities: {
      },
    }
  },
  plugins: {
    wdio: {
      enabled: true,
      services: ['browserstack'],
      user: 'adrienruizgauder1',
      key: 'EM5mQHRxeqErKyTPkRSt',
    },
    allure: {
      enabled: true,
    },
  },
  include: {
    I: './steps_file.js',
  },
  bootstrap: null,
  // mocha: {
  //   reporterOptions: {
  //       reportDir: "output"
  //   },
  // },
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
      fs.mkdirSync('allure-report');
    } catch(e) {
      console.log(`failed to create allure-report`)
    }

    try {
      fs.mkdirSync('allure-results');
    } catch(e) {
      console.log(`failed to create allure-results`)
    }    
  },    
};
