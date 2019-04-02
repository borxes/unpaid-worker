const mongoose = require('mongoose');
const { Schema } = mongoose;

const configSchema = new Schema({
  latestTweetID: String, // latest Tweet ID parsed
});

mongoose.model('config', configSchema);
