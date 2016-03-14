
module.exports = capturableMoney;

function capturableMoney (book1, book2, bitcoins, explain) {
  // buy bitcoins in exchange 1 and sell them in exchange 2
  var buyBook = book1.asks;
  var sellBook = book2.bids;
  var iPrice = 0;
  var iAmount = 1;

  if (bitcoins) {
    buyBook = book1.bids;
    sellBook = book2.asks;
    // iPrice = 1;
    // iAmount = 0;
  }

  if (!buyBook.length) {
    return 0;
  }
  if (!sellBook.length) {
    return 0;
  }

  var cost = 0;
  var sellPrice = 0;
  var fulfillableBids = sellBook
    .concat()
    .map(function (entry) {
      return entry.concat();
    });

  // price, qnty
  buyBook.forEach(function (ask) {
    // we buy from asks
    var askPrice = ask[iPrice];
    var askAmount = ask[iAmount];
    var bid = null;
    var amountToTake = 0;

    while (askAmount > 0 && fulfillableBids.length > 0) {
      bid = fulfillableBids[0];
      if (!bitcoins) {
        // we sell to bids
        if (bid[iPrice] <= askPrice) {
          break;
        }
        if (bid[iAmount] <= askAmount) {
          fulfillableBids.splice(0, 1);
        }

        amountToTake = Math.min(bid[iAmount], askAmount);

        bid[iAmount] -= amountToTake;
        askAmount -= amountToTake;

        cost += askPrice * amountToTake;
        sellPrice += bid[iPrice] * amountToTake;
      } else {
        // we buy cash from ask
        // and sell to bid
        // except we're selling bitcoins for money
        // then money for bitcoins
        // so we want to sell them high and buy them back low
        if (bid[iPrice] >= askPrice) {
          break;
        }
        log('Checking', bid);
        log('I have', askAmount, 'bitcoins i can sell at this price', askPrice);
        // buyable cash is the amount of $ we can turn askAmount btcs into
        var buyableCash = (askPrice * askAmount);
        log('I have', buyableCash, 'spending money');
        // amountToSell is the number of bitcoins we'd get back if we sold all of the cash
        var amountToSell = buyableCash / bid[iPrice];
        log('I can buy', amountToSell, 'bitcoins');
        if (amountToSell > bid[iAmount]) {
          // we're about to sell out all our cash and still have some left over
          log('Im about to use the whole bid');
          fulfillableBids.splice(0, 1);
        }
        // we don't want leftover cache, so we minimize downwards
        amountToSell = Math.min(amountToSell, bid[iAmount]);
        log('But only', amountToSell, 'are available, leaving', bid[iAmount] - amountToSell);
        // this is the number of bitcoins we need to sell in order to buy all of the others back
        amountToTake = (amountToSell * bid[iPrice]) / askPrice;
        log('it will cost me', amountToTake, 'bitcoins leaving me with', askAmount - amountToTake);

        // fulfill the buy request for bitcoins
        bid[iAmount] -= amountToSell;
        askAmount -= amountToTake;

        cost += amountToTake;
        sellPrice += amountToSell;
      }

      if (cost > sellPrice) {
        throw new Error('Math is broken');
      }
    }
  });

  return (~~((sellPrice - cost) * 100)) / 100;

  function log () {
    if (!explain) {
      return;
    }
    console.log.apply(console, arguments);
  }
}
