/* global beforeAll test expect afterAll*/

const mongoose = require('mongoose');
const keys = require('../config/keys');
require('../models/Coin');

beforeAll(() => {
  mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
});

test('Searching a coin ID by BTC symbol returns btc-bitcoin', async () => {
  const Coin = mongoose.model('coins');
  const id = await Coin.getCoinIdBySymbol('BTC');
  expect(id).toBe('btc-bitcoin');
});

afterAll(() => {
  mongoose.connection.close();
});
