const keys = require('../config/keys');

const options = {
  consumer_key: keys.twitterConsumerKey,
  consumer_secret: keys.twitterConsumerSecret,
  access_token_key: keys.twitterAccessTokenKey,
  access_token_secret: keys.twitterAccessTokenSecret,
};

const client = new require('twitter')(options);

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
  const BLACK_LIST = [
    '$BTC',
    '$btc',
    '$Crypto',
    '$CRYPTO',
    '$crypto',
    '$alts',
    '$ALTS',
  ];
  let tags = text.match(/(^|\s+)\$[a-zA-Z]{2,7}/gm);
  // remove $crypto and $btc tags
  // remove duplicate cashtags and trim whitespace
  tags = tags ? [...new Set(tags.map(tag => tag.trim()))] : [];
  return tags.filter(tag => !BLACK_LIST.includes(tag));
}

module.exports = {
  readStatuses,
  cashTags,
};
