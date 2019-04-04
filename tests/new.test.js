/* global expect test beforeAll afterAll */

const paprika = require('../services/coinPaprika');
const mongoose = require('mongoose');
const keys = require('../config/keys');
const twit = require('../services/twitService');

beforeAll(() => {
  mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
});

afterAll(() => {
  mongoose.connection.close();
});

test('getQuotesById', async () => {
  const price = await paprika.getQuotesById('eos-eos');
  console.log(price);
  expect(price).toHaveProperty('BTC');
});

test('cashtags', async () => {
  const cashtags = twit.cashTags(
    '$BTC $doge $BTCUSD $crypto hello $DOGE $Alts $USDT $eth'
  );
  console.log(cashtags);
  expect(cashtags).toContain('$DOGE');
  expect(cashtags).not.toContain('$doge');
  expect(cashtags).toContain('$ETH');
  expect(cashtags).not.toContain('$BTCUSD');
  expect(cashtags).not.toContain('$crypto');
});
