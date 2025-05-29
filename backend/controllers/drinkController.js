var DrinkModel = require('../models/drinkModel.js');

module.exports = {

    list: function (req, res) {
        DrinkModel.find(function (err, drinks) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting drinks.',
                    error: err
                });
            }
            return res.json(drinks);
        });
    },

    show: function (req, res) {
        var id = req.params.id;

        DrinkModel.findOne({ _id: id }, function (err, drink) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting drink.',
                    error: err
                });
            }
            if (!drink) {
                return res.status(404).json({
                    message: 'No such drink.'
                });
            }
            return res.json(drink);
        });
    },

    create: function (req, res) {
        var drink = new DrinkModel({
            name: req.body.name,
            type: req.body.type,
            image: req.body.image,
            price: req.body.price
        });

        drink.save(function (err, drink) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating drink.',
                    error: err
                });
            }
            return res.status(201).json(drink);
        });
    },

    update: function (req, res) {
        var id = req.params.id;

        DrinkModel.findOne({ _id: id }, function (err, drink) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting drink.',
                    error: err
                });
            }
            if (!drink) {
                return res.status(404).json({
                    message: 'No such drink.'
                });
            }

            drink.name = req.body.name ? req.body.name : drink.name;
            drink.type = req.body.type ? req.body.type : drink.type;
            drink.image = req.body.image ? req.body.image : drink.image;
            drink.price = req.body.price ? req.body.price : drink.price

            drink.save(function (err, drink) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating drink.',
                        error: err
                    });
                }
                return res.json(drink);
            });
        });
    },

    remove: function (req, res) {
        var id = req.params.id;

        DrinkModel.findByIdAndRemove(id, function (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting drink.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
