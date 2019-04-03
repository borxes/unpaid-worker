const mongoose = require('mongoose');
const { Schema } = mongoose;

const coinSchema = new Schema({
  id: String,
  name: String,
  symbol: String,
  rank: Number,
  type: String,
});

coinSchema.virtual('tag').get(function() {
  return '$' + this.symbol;
});

mongoose.model('coins', coinSchema);
