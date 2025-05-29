const express = require('express');
const router = express.Router();
const drinkController = require('../controllers/drinkController.js');

router.get('/', drinkController.list);
router.post('/', drinkController.create);

module.exports = router;
