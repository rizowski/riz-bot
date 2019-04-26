module.exports = {
  createRandRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  createRandMax(max) {
    return Math.floor(Math.random() * Math.floor(max));
  },
};
