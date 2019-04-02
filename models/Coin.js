const mongoose = require('mongoose');
const { Schema } = mongoose;

const coinSchema = new Schema({
  name: String,
});

mongoose.model('coins', coinSchema);
