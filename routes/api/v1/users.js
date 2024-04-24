const express = require('express');
const router = express.Router();
const users = require('../../../controllers/api/v1/users.js');

router.get('/', users.index);
router.post('/', users.create);
router.get('/:id', users.show);
router.post('/login', users.login);
router.post('/checkEmail', users.checkEmail);

module.exports = router;
