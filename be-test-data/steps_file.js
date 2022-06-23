// in this file you can append custom step methods to 'I' object
const steps = require('fe-test-data/steps_file');

module.exports = function() {
  // uses the steps_file from fe-test-data so funcitons aren't duplicated
  return Object.assign(actor({
    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.

    localMessageToAllureFunction: async function(text) {
      // can still use 'this' to reference functions from fe-test-data/steps_file
      this.addLogMessageToAllure(text, 'Custom Message calling addLogMessageToAllure from fe-test-data')
    },
  }), steps());
}
