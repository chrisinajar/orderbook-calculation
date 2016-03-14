var getCost = require('./getCost');

module.exports = getSpread;

function getSpread (book1, book2, depth, dontRound) {
  var spread = (1 -
    getCost(book2, 'bids', depth) /
    getCost(book1, 'bids', depth));

  return dontRound
    ? spread
    : Math.round(spread * 100000) / 1000;
}
