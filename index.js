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

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
const Tweet = mongoose.model('tweets');

const processTweet = async tweet => {
  const coins = twitter.cashTags(tweet.text);
  if (coins.length < 1) return; // do nothing with tweets that don't mention a coin
  const existingTweet = await Tweet.findOne({ id: tweet.id_str });
  if (existingTweet) {
    // shouldn't happen because we are fetching tweets later than the last saved tweet
    console.log(`Tweet ID ${tweet.id_str} is already in the db`);
    console.log(existingTweet);
    console.log('----------------------------------');
    return;
  } else {
    console.log(`Processing tweet ID ${tweet.id_str}`);
    const savedTweet = await new Tweet({
      text: tweet.text,
      id: tweet.id_str,
      trader: tweet.user.screen_name,
      coins: twitter.cashTags(tweet.text),
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

if (process.env.NODE_ENV === 'production') {
  const job = new CronJob('* 1 * * * *', main);
  job.start();
  console.log('Cron job started');
  const job2 = new CronJob(
    '10 * * * * *',
    function() {
      console.log('You will see this message every second');
    },
    null,
    true,
    'America/Los_Angeles'
  );
  job2.start();
} else {
  main();
}
