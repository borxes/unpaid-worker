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
    since_id,
    owner_screen_name: SCREEN_NAME,
    include_entities: false,
  });
}

// **************************************
// we can also use tweet.entities.symbols
// **************************************
function cashTags(text) {
  const tags = text.match(/(^|\s+)\$[a-zA-Z]{2,7}/gm);
  // remove duplicate cashtags and trim whitespace
  return tags ? [...new Set(tags.map(tag => tag.trim()))] : [];
}

module.exports = {
  readStatuses,
  cashTags,
};
