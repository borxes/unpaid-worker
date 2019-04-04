/* global expect test beforeAll afterAll */

const paprika = require('../services/coinPaprika');
const mongoose = require('mongoose');
const keys = require('../config/keys');
const twitService = require('../services/twitService');

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

test('cashtags', async () => {
  const text = '$CRYPTO $btc $BTC $doge $DOGE $ETH $icx $eos';
  const tags = twitService.cashTags(text);
  expect(tags).toContain('$DOGE');
  expect(tags).not.toContain('$doge');
  expect(tags).not.toContain('$CRYPTO');
  expect(tags).toContain('$ICX');
});
