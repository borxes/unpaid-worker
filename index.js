/* global process */

const mongoose = require('mongoose');
const async = require('async');
const moment = require('moment');
const CronJob = require('cron').CronJob;
const keys = require('./config/keys');
const twitter = require('./services/twitService');
const telegram = require('./services/tgService');
const tgMessage = require('./tgMessage');
require('./models/Tweet');
require('./models/Coin');

const STATUSES_PER_REQ = 50;

const Tweet = mongoose.model('tweets');

const processTweet = async tweet => {
  const coins = twitter.cashTags(tweet.text);

  // do nothing with tweets that don't mention a coin
  if (coins.length < 1) return;
  // don't save the same tweet twice
  const existingTweet = await Tweet.findOne({ id: tweet.id_str });
  if (existingTweet) {
    return;
  } else {
    const savedTweet = await new Tweet({
      text: tweet.text,
      id: tweet.id_str,
      trader: tweet.user.screen_name,
      coins: twitter.cashTags(tweet.text),
      date: moment.utc(tweet.created_at, twitter.TWITTER_DATE_FMT).toString(),
    }).save();
    console.log(`Saved to db: ${JSON.stringify(savedTweet)}`);
    const message = await tgMessage.buildTelegramPost(
      savedTweet.text,
      savedTweet.trader,
      savedTweet.URL
    );
    telegram.postMessage(message).catch(err => {
      console.log(err);
    });
  }
};

const main = () => {
  console.log(`${moment().format()}: Main Task running`);
  mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
  Tweet.latestId().then(latestId => {
    twitter
      .readStatuses(keys.slug, STATUSES_PER_REQ, latestId)
      .then(tweets => {
        console.log(`Received ${tweets.length} new tweets`);
        console.log(tweets.map(tweet => tweet.text));
        async.each(tweets, processTweet, () => {
          mongoose.connection.close();
        });
      })
      .catch(err => {
        console.log(err);
        mongoose.connection.close();
      });
  });
};

if (process.env.NODE_ENV === 'production') {
  // This activates the main task at second 10 of each minute
  const job = new CronJob('10 * * * * *', main);
  job.start();
  console.log('Cron job started');
} else {
  console.log('In development run "npm test"');
  main();
}
