const keys = require('../config/keys');

const options = {
  consumer_key: keys.twitterConsumerKey,
  consumer_secret: keys.twitterConsumerSecret,
  access_token_key: keys.twitterAccessTokenKey,
  access_token_secret: keys.twitterAccessTokenSecret,
};

const Twitter = require('twitter');
const client = new Twitter(options);

const TWITTER_DATE_FMT = 'ddd MMM D HH:mm:ss ZZ YYYY';

// returns a promise as a callback to client.get is not provided
function readStatuses(slug, count, since_id) {
  const SCREEN_NAME = 'yurasherman';
  console.log(`fetching statuses since ${since_id}`);
  return client.get('lists/statuses', {
    slug,
    count,
    since_id: since_id > 0 ? since_id : '100000',
    owner_screen_name: SCREEN_NAME,
    include_entities: false,
  });
}

// **************************************
// we can also use tweet.entities.symbols
// **************************************
function cashTags(text) {
  const BLACK_LIST = ['$BTC', '$CRYPTO', '$ALTS', '$USDT', '$BTCUSD'];
  let tags = text.toUpperCase().match(/(^|\s+)\$[A-Z]{2,7}/gm);

  // remove duplicate cashtags and trim whitespace
  tags = tags ? [...new Set(tags.map(tag => tag.trim()))] : [];
  return tags.filter(tag => !BLACK_LIST.includes(tag));
}

module.exports = {
  readStatuses,
  cashTags,
  TWITTER_DATE_FMT,
};
