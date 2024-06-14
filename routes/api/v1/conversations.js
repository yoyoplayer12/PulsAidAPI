const express = require('express');
const router = express.Router();
const conversations = require('../../../controllers/api/v1/conversations.js');

router.get('/', conversations.index);
router.post('/', conversations.create);
router.get('/:id', conversations.show);
router.get('/showfive/:platform/:helpuserId', conversations.showFive);
router.get('/senduser/:id', conversations.sendNotificationToUser);

module.exports = router;