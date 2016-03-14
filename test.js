var test = require('tape');
var capturableMoney = require('./capturableMoney');

test('table math', function (t) {
  var result = capturableMoney({
    asks: [[100, 10]],
    bids: []
  }, {
    bids: [[110, 10]],
    asks: []
  });
  t.equal(result, 100, 'should find $100 capturable');

  result = capturableMoney({
    asks: [[100, 20]],
    bids: []
  }, {
    bids: [[110, 10], [105, 5], [90, 10]],
    asks: []
  });
  t.equal(result, 125, 'should find $125 capturable');

  result = capturableMoney({
    bids: [[100, 10]],
    asks: []
  }, {
    asks: [[50, 19], [110, 10]],
    bids: []
  }, true);
  t.equal(result, 9.5, 'should find 9.5btc capturable');

  result = capturableMoney({
    bids: [[100, 10]],
    asks: []
  }, {
    asks: [[(1000) / 16, 15]],
    bids: []
  }, true);
  // expect rouding down to nearest 0.01
  t.equal(result, 5.62, 'should find 5.62btc capturable');

  result = capturableMoney({
    bids: [[100, 5], [100, 5]],
    asks: []
  }, {
    asks: [[(1000) / 16, 15], [1000 / 16, 10]],
    bids: []
  }, true);
  t.equal(result, 6, 'should find 6btc capturable');

  result = capturableMoney({
    // sell 4 and 4, get back 400 + 320, 720
    bids: [[100, 4], [80, 8]],
    asks: []
  }, {
    // sell 720 worth, get 12 back (from 8 invested), net +4
    asks: [[60, 12], [1200 / 11, 12]],
    bids: []
  }, true);
  t.equal(result, 4, 'should find 4btc capturable');

  t.end();
});
