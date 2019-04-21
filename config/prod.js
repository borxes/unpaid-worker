/* global process */

module.exports = {
  mongoURI: process.env.MONGO_URI,
  twitterConsumerKey: process.env.TWITTER_CONSUMER_KEY,
  twitterConsumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  twitterAccessTokenKey: process.env.TWITTER_ACCESS_TOKEN_KEY,
  twitterAccessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  telegramToken: process.env.TELEGRAM_TOKEN,
  nomicsKey: process.env.NOMICS_KEY,
};
