const mongoose = require('mongoose');
const { Schema } = mongoose;

const signalSchema = new Schema({
  coin: String,
  signalPrice: { btcPrice: Number, usdPrice: Number },
  trader: String,
  tweet: String, // tweet ID
  date: Date,
});

mongoose.model('signals', signalSchema);
