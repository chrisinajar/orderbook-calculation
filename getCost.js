module.exports = getCost;

function getCost (book, attr, amount) {
  // cost, amount
  if (!amount) {
    throw new Error('You must specify a book depth');
  }
  if (!book[attr].length) {
    return 0;
  }
  var totalFound = 0;
  var cost = 0;
  book[attr].forEach(function (entry) {
    if (amount <= 0) {
      return;
    }

    var entryCost = entry[0];
    var entryAmount = entry[1];
    var amountToRemove = Math.min(amount, entryAmount);

    amount -= amountToRemove;
    totalFound += amountToRemove;
    cost += amountToRemove * entryCost;
  });

  if (amount > 0) {
    // console.warn("Couldn't get 100 coins");
    cost = (cost / totalFound) * (totalFound + amount);
  }

  return cost;
}
