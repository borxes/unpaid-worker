/* global beforeAll test expect afterAll*/

const mongoose = require('mongoose');
const keys = require('../config/keys');
const paprika = require('../services/coinPaprika');
const tgMessage = require('../tgMessage');
require('../models/Coin');

const Coin = mongoose.model('coins');

beforeAll(() => {
  mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
});

afterAll(() => {
  mongoose.connection.close();
});

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
  const tgPost = await tgMessage.buildTelegramPost(
    '$FTM $ICX for the win!! and $HZZ too!!',
    'korean',
    'http://url'
  );
  console.log(tgPost), expect(tgPost).toMatch(/FTM/);
});
