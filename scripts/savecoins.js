// Write all cryptocurrencies symbols to the mongo DB

const mongoose = require('mongoose');
const async = require('async');
const keys = require('../config/keys');
require('../models/Coin');
const coinPaprikaAPI = require('@coinpaprika/api-nodejs-client');

const client = new coinPaprikaAPI();
const Coin = mongoose.model('coins');

const saveCoin = async coin => {
  const existingCoin = await Coin.findOne({ id: coin.id });
  if (existingCoin) {
    return;
  } else {
    const savedCoin = await new Coin({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      rank: coin.rank,
      type: coin.type,
    }).save();
    console.log(`Saved coin ${savedCoin.id}`);
  }
};

const main = async () => {
  mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
  const coins = await client.getCoins();
  async.each(coins, saveCoin, () => {
    mongoose.connection.close();
  });
};

main();
