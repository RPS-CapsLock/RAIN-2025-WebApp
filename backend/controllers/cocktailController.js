var CocktailModel = require('../models/cocktailModel.js');

module.exports = {

    list: function (req, res) {
        CocktailModel.find()
            .populate('ingredients')
            .exec(function (err, cocktails) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting cocktails.',
                        error: err
                    });
                }
                return res.json(cocktails);
            });
    },

    show: function (req, res) {
        var id = req.params.id;

        CocktailModel.findOne({ _id: id })
            .populate('ingredients')
            .exec(function (err, cocktail) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting cocktail.',
                        error: err
                    });
                }
                if (!cocktail) {
                    return res.status(404).json({
                        message: 'No such cocktail.'
                    });
                }
                return res.json(cocktail);
            });
    },

    create: function (req, res) {
        var cocktail = new CocktailModel({
            name: req.body.name,
            ingredients: req.body.ingredients, // array of Drink IDs
            image: req.body.image,
            price: req.body.price,
            custom: req.body.custom
        });

        cocktail.save(function (err, cocktail) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating cocktail.',
                    error: err
                });
            }
            return res.status(201).json(cocktail);
        });
    },

    update: function (req, res) {
        var id = req.params.id;

        CocktailModel.findOne({ _id: id }, function (err, cocktail) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting cocktail.',
                    error: err
                });
            }
            if (!cocktail) {
                return res.status(404).json({
                    message: 'No such cocktail.'
                });
            }

            cocktail.name = req.body.name ? req.body.name : cocktail.name;
            cocktail.ingredients = req.body.ingredients ? req.body.ingredients : cocktail.ingredients;
            cocktail.image = req.body.image ? req.body.image : cocktail.image;
            cocktail.price = req.body.price ? req.body.price : cocktail.price;
            cocktail.custom = req.body.custom ? req.body.custom : cocktail.custom;

            cocktail.save(function (err, cocktail) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating cocktail.',
                        error: err
                    });
                }
                return res.json(cocktail);
            });
        });
    },

    remove: function (req, res) {
        var id = req.params.id;

        CocktailModel.findByIdAndRemove(id, function (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting cocktail.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
