var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

router.get('/logout', userController.logout);

router.post('/register', userController.create);
router.post('/login', userController.login);

module.exports = router;
