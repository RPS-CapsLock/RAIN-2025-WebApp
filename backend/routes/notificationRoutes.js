const express = require('express');
const router = express.Router();
const admin = require('../firebase');

router.post('/send', async (req, res) => {
  const { deviceToken, requestId } = req.body;

const message = {
  token: deviceToken,
  notification: {
    title: 'Prijava s Face ID',
    body: 'Prosimo, potrdite svojo prijavo na mobilni napravi.',
  },
  android: {
    priority: "high",
    notification: {
      channel_id: "default_channel_id" 
    }
  },
  data: {
    requestId: requestId,
  }
};

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error });
  }
});

module.exports = router;
