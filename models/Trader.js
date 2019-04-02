const mongoose = require('mongoose');
const { Schema } = mongoose;

const traderSchema = new Schema({
  screenName: String,
  twitterID: String,
  followers: Number,
});

module.exports = traderSchema;
