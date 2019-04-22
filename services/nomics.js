const keys = require('../config/keys');
const axios = require('axios');
const mem = require('mem');
const moment = require('moment');

const ENDPOINT = 'https://api.nomics.com/v1';

// use default demo key if we don't have our own key
const API_KEY = keys.nomicsKey || '2018-09-demo-dont-deploy-b69315e440beb145';

// cache price info for 10 seconds
const PRICE_MAX_AGE = 10000;

// cache currencies list for one day
const CURRENCIES_MAX_AGE = 1000 * 60 * 60 * 24;

const Intervals = {
  '1h': { num: 1, str: 'hours' },
  '24h': { num: 24, str: 'hours' },
  '1d': { num: 1, str: 'days' },
  '1m': { num: 1, str: 'minutes' },
  '7d': { num: 7, str: 'days' },
};

const currencies = async () => {
  const req = `${ENDPOINT}/currencies?key=${API_KEY}`;
  const res = await axios.get(req);
  return res.data;
};

const prices = async () => {
  const req = `${ENDPOINT}/prices?key=${API_KEY}`;
  const res = await axios.get(req);
  return res.data;
};

const exchangeRates = async () => {
  const req = `${ENDPOINT}/exchange-rates?key=${API_KEY}`;
  const res = await axios.get(req);
  return res.data;
};

// currenciesInterval(moment().subtract(1, 'hours'))
const currenciesInterval = async from => {
  const now = encodeURIComponent(
    moment()
      .utc()
      .format()
  );
  const start = encodeURIComponent(from.utc().format());
  const req = `${ENDPOINT}/currencies/interval?key=${API_KEY}&start=${start}&end=${now}`;
  console.log(req);
  const res = await axios.get(req);
  return res.data;
};

// not cached because it relies on the memoized prices() function
const getTickerPrice = async ticker => {
  try {
    const prices = await getPrices();
    const exchangeRates = await getExchangeRates();
    const usdPrice = Number(
      prices.find(elem => elem.currency === ticker).price
    );
    const btcToUSD = exchangeRates.find(rate => rate.currency === 'BTC').rate;
    const btcPrice = usdPrice / btcToUSD;
    return {
      usdPrice,
      btcPrice,
    };
  } catch (e) {
    return {
      usdPrice: 0,
      btcPrice: 0,
    };
  }
};

// returns price changes for an Array of tickers
const getTickersPriceChange = async tickers => {
  const formatPct = (open, close) => {
    const change =
      (Number.parseFloat(close) / Number.parseFloat(open)) * 100 - 100;
    return change.toFixed(2);
  };

  try {
    const h1Intervals = await getCurrenciesInterval(
      moment().subtract(1, 'hours')
    );

    const d1Intervals = await getCurrenciesInterval(
      moment().subtract(24, 'hours')
    );
    const d7Intervals = await getCurrenciesInterval(
      moment().subtract(7, 'days')
    );

    const result = {};
    tickers.forEach(ticker => {
      const h1Interval = h1Intervals.find(
        interval => interval.currency === ticker
      );
      const d1Interval = d1Intervals.find(
        interval => interval.currency === ticker
      );
      const d7Interval = d7Intervals.find(
        interval => interval.currency === ticker
      );
      result[ticker] = {
        h1Change: formatPct(h1Interval.open, h1Interval.close),
        d1Change: formatPct(d1Interval.open, d1Interval.close),
        d7Change: formatPct(d7Interval.open, d7Interval.close),
      };
    });
    return result;
  } catch (e) {
    console.log(e);
    return [];
  }
};

const getCurrencies = mem(currencies, { maxAge: CURRENCIES_MAX_AGE });
const getPrices = mem(prices, { maxAge: PRICE_MAX_AGE });
const getExchangeRates = mem(exchangeRates, { maxAge: PRICE_MAX_AGE });
const getCurrenciesInterval = mem(currenciesInterval, {
  maxAge: PRICE_MAX_AGE,
});

module.exports = {
  getCurrencies,
  getPrices,
  getTickerPrice,
  getExchangeRates,
  getCurrenciesInterval,
  getTickersPriceChange,
};
