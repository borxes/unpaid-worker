/* global test expect */
const nomics = require('../services/nomics');

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
  const ethPrice = await nomics.getTickerPrice('ETH');
  console.log(ethPrice);
  expect(ethPrice).toHaveProperty('usdPrice');
  expect(ethPrice).toHaveProperty('btcPrice');
  const nonPrice = await nomics.getTickerPrice('QWERTY');
  expect(nonPrice.btcPrice).toBe(NaN);
});
