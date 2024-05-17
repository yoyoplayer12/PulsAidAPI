const express = require('express');
const router = express.Router();
const sideNotifications = require('../../../controllers/api/v1/sideNotifications.js');

router.get('/', sideNotifications.index);
router.get('/:id', sideNotifications.show);

module.exports = router;