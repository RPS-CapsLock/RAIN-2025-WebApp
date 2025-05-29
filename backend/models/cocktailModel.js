const mongoose = require('mongoose');

const cocktailSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drink',
    required: true
  }],
  image: String,
  price: { type: Number, required: true },
  custom: { type: Boolean, default: false }
});

module.exports = mongoose.model('Cocktail', cocktailSchema);
