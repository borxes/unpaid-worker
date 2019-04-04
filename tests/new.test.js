/* global expect test beforeAll afterAll */

const paprika = require('../services/coinPaprika');
const mongoose = require('mongoose');
const keys = require('../config/keys');
const twitService = require('../services/twitService');
const tgMessage = require('../tgMessage');

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
  const text = '$CRYPTO $btc $BTC $doge $DOGE $ETH $icx $eos';
  const tags = twitService.cashTags(text);
  expect(tags).toContain('$DOGE');
  expect(tags).not.toContain('$doge');
  expect(tags).not.toContain('$CRYPTO');
  expect(tags).toContain('$ICX');
});

test('numeric conversion', async () => {
  const tgPost = await tgMessage.buildTelegramPost(
    '$TRTL Sometimes the turtle is faster than the hare',
    'korean',
    'http://url'
  );
  console.log(tgPost), expect(tgPost).toMatch(/TRTL/);
});
