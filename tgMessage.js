const mongoose = require('mongoose');
const paprika = require('./services/coinPaprika');
const twitter = require('./services/twitService');
require('./models/Coin');

const Coin = mongoose.model('coins');

const getPriceBySymbol = async symbol => {
  const coinId = await Coin.getCoinIdBySymbol(symbol);
  const price = await paprika.getPriceById(coinId);
  return price;
};

const buildTelegramPost = async (text, trader, URL) => {
  const coins = twitter.cashTags(text);
  const prices = {};

  for (const coin of coins) {
    prices[coin] = await getPriceBySymbol(coin);
  }

  return (
    `${coins
      .map(
        coin =>
          `*${coin}* (current price: ${prices[coin] &&
            prices[coin].btcPrice} BTC | ${prices[coin] &&
            prices[coin].usdPrice} USD) \n`
      )
      .join('')}\n` +
    `_${trader}_: ${text}\n\n` +
    `${URL}`
  );
};

module.exports = {
  buildTelegramPost,
};
