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
  if (symbol[0] === '$') {
    symbol = symbol.substring(1);
  }
  const coin = await this.findOne({ symbol: symbol.toUpperCase() });
  return coin ? coin.id : undefined;
};

mongoose.model('coins', coinSchema);
