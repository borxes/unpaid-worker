/* global expect test beforeAll afterAll */

const paprika = require('../services/coinPaprika');
const mongoose = require('mongoose');
const keys = require('../config/keys');

beforeAll(() => {
  mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
});

afterAll(() => {
  mongoose.connection.close();
});

test('paprika API', async () => {
  const price = await paprika.getPriceById('eos-eos');
  console.log(price);
  expect(price).toHaveProperty('percentChange1h');
});

test('getQuotesById', async () => {
  const price = await paprika.getQuotesById('eos-eos');
  console.log(price);
  expect(price).toHaveProperty('BTC');
});
