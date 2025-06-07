const express = require('express');
const router = express.Router();
const paketnikController = require('../controllers/paketnikController');

// Najprej statične poti:
router.get('/', paketnikController.list);
router.get('/my-paketniki', paketnikController.getMyPaketniki); // <- PREJ!

// Potem dinamične poti:
router.post('/:id/log', paketnikController.logBoxStatus);
router.get('/:id', paketnikController.show);
router.post('/', paketnikController.create);
router.put('/:id', paketnikController.update);
router.delete('/:id', paketnikController.remove);

module.exports = router;
