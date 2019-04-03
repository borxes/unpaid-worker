// Cryptocurrency prices API
const coinPaprikaAPI = require('@coinpaprika/api-nodejs-client');

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
  return {
    btcPrice: ticker.price_btc || 'not found',
    usdPrice: ticker.price_usd || 'not found',
    percentChange1h: ticker.percent_change_1h,
    percentChange24h: ticker.percent_change_24h,
    percentChange7d: ticker.percent_change_7d,
  };
};

module.exports = {
  getPriceById,
};
