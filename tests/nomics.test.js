/* global test expect */
const nomics = require('../services/nomics');
const moment = require('moment');

const TIMEOUT = 10000;

test(
  'currencies',
  async () => {
    const currencies = await nomics.getCurrencies();
    console.log(currencies.slice(0, 5));
    expect(currencies).toEqual(
      expect.arrayContaining([{ id: 'BTC' }, { id: 'ZEN' }])
    );
  },
  TIMEOUT
);

test(
  'prices',
  async () => {
    const prices = await nomics.getPrices();
    console.log(prices.slice(0, 5));
    expect(prices[0].currency).toBe('18C');
  },
  TIMEOUT
);

test('getTickerPrice', async () => {
  const ethPrice = await nomics.getTickerPrice('ICX');
  console.log(ethPrice);
  expect(ethPrice).toHaveProperty('usdPrice');
  expect(typeof ethPrice.usdPrice).toBe('number');
  expect(ethPrice).toHaveProperty('btcPrice');
  expect(ethPrice.btcPrice).not.toBeNaN();
  const nonPrice = await nomics.getTickerPrice('QWERTY');
  expect(nonPrice.btcPrice).toBe(0);
});

test('getCurrenciesInterval', async () => {
  const prices1hr = await nomics.getCurrenciesInterval(
    moment().subtract(1, 'hours')
  );
  expect(prices1hr).toBeDefined();
  console.log(prices1hr.slice(2, 5));
});

test(
  'getTickersPriceChange',
  async () => {
    const changes = await nomics.getTickersPriceChange(['ETH', 'ICX', 'BTC']);
    console.log(changes);
    expect(changes).toBeDefined();
  },
  TIMEOUT * 4
);
