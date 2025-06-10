const CartItem = require('../models/CartItem');

module.exports = {
  addToCart: async function (req, res) {
    try {
      const { userId, cocktailId } = req.body;

      let item = await CartItem.findOne({ user: userId, cocktail: cocktailId });

      if (item) {
        item.quantity += 1;
      } else {
        item = new CartItem({ user: userId, cocktail: cocktailId });
      }

      await item.save();
      res.status(200).json({ message: 'Dodano v košarico' });
    } catch (err) {
      res.status(500).json({ message: 'Napaka pri dodajanju', error: err });
    }
  },

  getCart: async function (req, res) {
    try {
      const { userId } = req.params;
      const items = await CartItem.find({ user: userId }).populate('cocktail');
      res.status(200).json(items);
    } catch (err) {
      res.status(500).json({ message: 'Napaka pri pridobivanju', error: err });
    }
  },

  removeItem: async function (req, res) {
    try {
      const { itemId } = req.params;
      await CartItem.findByIdAndDelete(itemId);
      res.status(200).json({ message: 'Odstranjeno iz košarice' });
    } catch (err) {
      res.status(500).json({ message: 'Napaka pri brisanju', error: err });
    }
  },

  clearCart: async function (req, res) {
    try {
      const { userId } = req.params;
      await CartItem.deleteMany({ user: userId });
      res.status(200).json({ message: 'Košarica izpraznjena' });
    } catch (err) {
      res.status(500).json({ message: 'Napaka pri brisanju košarice', error: err });
    }
  }
};
