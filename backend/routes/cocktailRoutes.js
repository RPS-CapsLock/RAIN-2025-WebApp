const express = require('express');
const router = express.Router();
const cocktailController = require('../controllers/cocktailController.js');

router.get('/', cocktailController.list);
router.post('/', cocktailController.create);
router.delete('/:id', cocktailController.remove);

module.exports = router;
