// in this file you can append custom step methods to 'I' object
const steps = require('fe-test-data/steps_file');

module.exports = function() {
  return Object.assign(actor({

    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.

  }), steps());
}
