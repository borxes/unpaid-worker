const mongoose = require('mongoose');
const { Schema } = mongoose;

const coinSchema = new Schema({
  id: String,
  name: String,
  symbol: String,
  rank: Number,
  type: String,
});

coinSchema.virtual('cashtag').get(function() {
  return '$' + this.symbol;
});

// coin id is needed to get coin info from the Paprika API
coinSchema.statics.getCoinIdBySymbol = async function(symbol) {
  const coin = await this.findOne({ symbol });
  return coin.id;
};

mongoose.model('coins', coinSchema);
