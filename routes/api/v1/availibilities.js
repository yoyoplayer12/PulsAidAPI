const express = require('express');
const router = express.Router();
const conversations = require('../../../controllers/api/v1/availibilty.js');

router.get('/', conversations.index);
router.post('/', conversations.create);

module.exports = router;