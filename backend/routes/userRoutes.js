var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

router.get('/', userController.list);
router.get('/profile', userController.profile);
router.get('/logout', userController.logout);
router.get('/mylogs', userController.getMyLogs);
router.get('/c_2fa', userController.c_2FA);
router.get('/:id', userController.show);

router.post('/', userController.create);
router.post('/login', userController.login);
router.post('/login_2fa', userController.login_2fa);
// router.post('/login_2fa0', userController.login_2fa0);

router.put('/:id', userController.update);

router.delete('/:id', userController.remove);

module.exports = router;
