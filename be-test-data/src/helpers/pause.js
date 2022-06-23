const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const pauseSync = (ms) => {
  const start = new Date();
  while ((new Date()) - start <= ms) { /* */ }
};

module.exports = {
  pause,
  pauseSync,
};
