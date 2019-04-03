/* global beforeAll test expect afterAll*/

const mongoose = require('mongoose');
const keys = require('../config/keys');
const coinPaprika = require('../services/coinPaprika');
require('../models/Coin');

beforeAll(() => {
  mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
});

test('Searching a coin ID by BTC symbol returns btc-bitcoin', async () => {
  const Coin = mongoose.model('coins');
  const id = await Coin.getCoinIdBySymbol('BTC');
  console.log(id);
  expect(id).toBe('btc-bitcoin');
});

test('Searching a coin ID by eos symbol (lower case) returns eos-eos', async () => {
  const Coin = mongoose.model('coins');
  const id = await Coin.getCoinIdBySymbol('eos');
  console.log(id);
  expect(id).toBe('eos-eos');
});

test('Searching for Ethereum price returns current price', async () => {
  const { btcPrice, usdPrice } = await coinPaprika.getPriceById('eth-ethereum');
  console.log(`ETH price in BTC: ${btcPrice} in USD: ${usdPrice}`);
  expect(Number(btcPrice)).toBeGreaterThan(0.01);
  expect(Number(btcPrice)).toBeLessThan(0.5);
});

afterAll(() => {
  mongoose.connection.close();
});
