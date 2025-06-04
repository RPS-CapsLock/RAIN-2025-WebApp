const mongoose = require('mongoose');

const drinkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['alcoholic', 'non-alcoholic'], required: true },
  image: { type: String },
  price: { type: Number, required: true }
});

module.exports = mongoose.model('Drink', drinkSchema);
