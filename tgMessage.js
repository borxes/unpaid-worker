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

const buildCoinRow = (
  coin,
  { btcPrice, usdPrice, percentChange1h, percentChange24h, percentChange7d }
) => {
  let result = `*${coin}* \n`;
  if (
    !btcPrice ||
    btcPrice === 'not found' ||
    !usdPrice ||
    usdPrice === 'not found'
  )
    return result;
  result += `current price: ${btcPrice} BTC\n`;
  result += `current price: $${usdPrice} USD\n`;
  if (percentChange1h) result += `1h change: %${percentChange1h}\n`;
  if (percentChange24h) result += `24h change: %${percentChange24h}\n`;
  if (percentChange7d) result += `7d change: %${percentChange7d}\n`;
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
