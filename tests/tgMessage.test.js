/* global beforeAll test expect afterAll*/

const mongoose = require('mongoose');
const keys = require('../config/keys');
const paprika = require('../services/coinPaprika');
const twitter = require('../services/twitService');
require('../models/Coin');

const Coin = mongoose.model('coins');

beforeAll(() => {
  mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
});

afterAll(() => {
  mongoose.connection.close();
});

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

const getPriceBySymbol = async symbol => {
  const coinId = await Coin.getCoinIdBySymbol(symbol);
  const price = await paprika.getPriceById(coinId);
  return price;
};

test('getPriceBySymbol(ETH) works', async () => {
  const { btcPrice, usdPrice } = await getPriceBySymbol('ETH');
  console.log(`ETH price: $${usdPrice}`);
  expect(Number(btcPrice)).toBeGreaterThan(0.01);
  expect(Number(btcPrice)).toBeLessThan(0.5);
});

test('getPriceBySymbol($ETH) works', async () => {
  const { btcPrice, usdPrice } = await getPriceBySymbol('$ETH');
  console.log(`ETH price: $${usdPrice}`);
  expect(Number(btcPrice)).toBeGreaterThan(0.01);
  expect(Number(btcPrice)).toBeLessThan(0.5);
});

test('getPriceBySymbol(Bullshit) does not throw error', async () => {
  const { btcPrice, usdPrice } = await getPriceBySymbol('NONSENSE');
  console.log(`NONsense price: $${usdPrice}`);
  expect(btcPrice).toBe('not found');
});

test('buildTelegramMessage functions', async () => {
  const tgPost = await buildTelegramPost(
    '$FTM $ICX for the win!!',
    'korean',
    'http://url'
  );
  console.log(tgPost), expect(tgPost).toMatch(/FTM/);
});
