const mongoose = require('mongoose');
const paprika = require('./services/coinPaprika');
const twitter = require('./services/twitService');
require('./models/Coin');

const Coin = mongoose.model('coins');

const getPriceBySymbol = async symbol => {
  const coinId = await Coin.getCoinIdBySymbol(symbol);
  const price = await paprika.getQuotesById(coinId);
  return price;
};

const buildCoinRow = (coin, { BTC, USD }) => {
  let result = `*${coin}* \n`;
  if (!BTC || !USD) return result;
  result += `Current price BTC: ${BTC.price} \n Current price USD: $${
    USD.price
  }\n`;
  result += `1h change: ${BTC.percent_change_1h}% BTC ${
    USD.percent_change_1h
  }% USD\n`;
  result += `24h change: ${BTC.percent_change_24h}% BTC ${
    USD.percent_change_24h
  }% USD\n`;
  result += `7d change: ${BTC.percent_change_7d}% BTC ${
    USD.percent_change_7d
  }% USD\n`;
  return result;
};

const buildTelegramPost = async (text, trader, URL) => {
  const coins = twitter.cashTags(text);
  const prices = {};

  for (const coin of coins) {
    prices[coin] = await getPriceBySymbol(coin);
  }

  return (
    `${coins.map(coin => buildCoinRow(coin, prices[coin])).join('\n')}\n` +
    `_${trader}_: ${text}\n\n` +
    `${URL}`
  );
};

module.exports = {
  buildTelegramPost,
};
