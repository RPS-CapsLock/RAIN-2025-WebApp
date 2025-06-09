const express = require('express');
const router = express.Router();

// Uporabimo enostaven objekt za shranjevanje potrjenih prijav (v spominu)
let pendingLogins = {}; 

// API: Sprejme potrditev prijave iz Android aplikacije
router.post('/approve', (req, res) => {
  const { requestId } = req.body;

  if (requestId) {
    pendingLogins[requestId] = true; // Označi prijavo kot potrjeno
    console.log(`Login approved for requestId: ${requestId}`);
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Missing requestId' });
  }
});

// API: Web app lahko preveri status prijave
router.get('/status/:requestId', (req, res) => {
  const requestId = req.params.requestId;
  if (pendingLogins[requestId]) {
    res.status(200).json({ approved: true });
  } else {
    res.status(200).json({ approved: false });
  }
});

module.exports = router;
