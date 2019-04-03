const mongoose = require('mongoose');
const { Schema } = mongoose;

// TODO: expland schema to to Coin and Trader subdocuments

const tweetSchema = new Schema({
  text: String,
  id: String,
  //coins: [signalSchema],
  coins: [String], // for simplicity
  //trader: traderSchema,
  trader: String, // for simplicty
  date: Date,
});

tweetSchema.statics.latestId = async function() {
  const latestTweet = await this.find({})
    .sort('-id')
    .limit(1);
  return latestTweet[0] ? latestTweet[0].id : 0;
};

tweetSchema.virtual('URL').get(function() {
  return `https://www.twitter.com/statuses/${this.id}`;
});

mongoose.model('tweets', tweetSchema);
