// Cryptocurrency prices API
const coinPaprikaAPI = require('@coinpaprika/api-nodejs-client');
const axios = require('axios');

const BASE_ENDPOINT = 'https://api.coinpaprika.com/v1/';

const client = new coinPaprikaAPI();

const getPriceById = async coinId => {
  if (!coinId)
    return {
      btcPrice: 'not found',
      usdPrice: 'not found',
    };
  coinId = coinId[0] === '$' ? coinId.substring(1) : coinId;
  const ticker = await client.getTicker({
    coinId,
    quotes: 'BTC, USD',
  });
  const tickerBTC = await client.getTicker({ coinId, quotes: 'BTC' });
  return {
    btcPrice: ticker.price_btc || 'not found',
    usdPrice: ticker.price_usd || 'not found',
    percentChange1h: ticker.percent_change_1h,
    percentChange24h: ticker.percent_change_24h,
    percentChange7d: ticker.percent_change_7d,
    percentChange1hBTC: tickerBTC.percent_change_1h,
    percentChange24hBTC: tickerBTC.percent_change_24h,
    percentChange7dBTC: tickerBTC.percent_change_7d,
  };
};

const getQuotesById = async coinId => {
  if (!coinId)
    return {
      BTC: null,
      USD: null,
    };
  const ticker = await axios.get(`${BASE_ENDPOINT}/tickers/${coinId}`, {
    params: {
      quotes: 'USD,BTC',
    },
  });
  const data = await ticker.data.quotes;
  return data;
};

module.exports = {
  getPriceById,
  getQuotesById,
};
