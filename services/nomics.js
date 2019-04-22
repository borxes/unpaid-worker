const keys = require('../config/keys');
const axios = require('axios');
const mem = require('mem');

const ENDPOINT = 'https://api.nomics.com/v1';
const API_KEY = keys.nomicsKey || '2018-09-demo-dont-deploy-b69315e440beb145';
const PRICE_MAX_AGE = 10000; // cache price info for 10 seconds
const CURRENCIES_MAX_AGE = 1000 * 60 * 60 * 24; // cache currencies list for one day

const currencies = async () => {
  const req = `${ENDPOINT}/currencies?key=${API_KEY}`;
  console.log(req);
  const res = await axios.get(req);
  return res.data;
};

const prices = async () => {
  const req = `${ENDPOINT}/prices?key=${API_KEY}`;
  console.log(req);
  const res = await axios.get(req);
  return res.data;
};

const exchangeRates = async () => {
  const req = `${ENDPOINT}/exchange-rates?key=${API_KEY}`;
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

const getCurrencies = mem(currencies, { maxAge: CURRENCIES_MAX_AGE });
const getPrices = mem(prices, { maxAge: PRICE_MAX_AGE });
const getExchangeRates = mem(exchangeRates, { maxAge: PRICE_MAX_AGE });

module.exports = {
  getCurrencies,
  getPrices,
  getTickerPrice,
  getExchangeRates,
};
