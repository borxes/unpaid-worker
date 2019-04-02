const mongoose = require('mongoose');
const { Schema } = mongoose;

const signalSchema = new Schema({
  //_coin: { type: Schema.Types.ObjectId, ref: 'Coin' },

  // for simplicity avoid coin collection for now
  coin: String,
  mentionPrice: { type: Number, default: 0 },
});

module.exports = signalSchema;
