const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  'user': { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user', 
    required: true 
},
  'cocktail': { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cocktail', 
    required: true 
},
  'quantity': { 
    type: Number, 
    default: 1 }
});

module.exports = mongoose.model('CartItem', cartItemSchema);
