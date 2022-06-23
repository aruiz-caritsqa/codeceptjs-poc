/* eslint-disable no-await-in-loop */
const needle = require('needle');
const { pause } = require('./pause');

const request = async (...payload) => {
  let res;
  const maxAttempts = payload.maxAttempts || 5;
  
  console.log(`request :: curl -X ${payload[0]} "${payload[1]}" ${payload[3] && payload[3].headers ? Object.entries(payload[3].headers).map(([k, v]) => `-H "${k}:${v}"`).join(' ') : ''} --data '${JSON.stringify(payload[2])}'`);
  
  for (let i = 1; i <= maxAttempts; i += 1) {
    try {
      // TODO: needle seems to log the Promise at this point
      // Need to switch to axios
      res = await needle(...payload);
      break;
    } catch (e) {
      console.log(`request :: Attempt #${i}/${maxAttempts}: ${e} => curl -X ${payload[0]} "${payload[1]}" ${payload[3] && payload[3].headers ? Object.entries(payload[3].headers).map(([k, v]) => `-H "${k}:${v}"`).join(' ') : ''} --data '${JSON.stringify(payload[2])}'`);

      if (i >= maxAttempts) {
        throw e;
      }
      await pause(2000);
    }
  }
  return res;
};

module.exports = {
  request,
};
