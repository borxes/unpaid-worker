/* global process */

const mongoose = require('mongoose');
const async = require('async');
const moment = require('moment');
const CronJob = require('cron').CronJob;
const keys = require('./config/keys');
const twitter = require('./services/twitService');
const telegram = require('./services/tgService');
require('./models/Tweet');

console.log(process.env.NODE_ENV);

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
    telegram
      .postMessage(
        `${coins.map(coin => `*${coin}*`).join(' ')}\n\n` +
          `_${tweet.user.screen_name}_: ${tweet.text}\n\n` +
          `${savedTweet.URL}`
      )
      .catch(err => {
        console.log(err);
      });
  }
};

const main = () => {
  console.log(`${moment().format()}: Main Task running`);
  mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
  Tweet.latestId().then(res => {
    const latestId = res;
    twitter
      .readStatuses(keys.slug, STATUSES_PER_REQ, latestId)
      .then(tweets => {
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

const FORMAT = 'ddd MMM D HH:mm:ss ZZ YYYY';

const test = () => {
  twitter.readStatuses(keys.slug, 1).then(tweets => {
    const date = tweets[0].created_at;
    console.log(
      `created_at ${date} moment: ${moment.utc(date, FORMAT).toString()}`
    );
  });
};

if (process.env.NODE_ENV === 'production') {
  // This activates the main task at second 10 of each minute
  const job = new CronJob('10 * * * * *', main);
  job.start();
  console.log('Cron job started');
} else {
  test();
}
