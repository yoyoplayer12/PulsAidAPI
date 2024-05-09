const express = require('express');
const router = express.Router();
const users = require('../../../controllers/api/v1/users.js');

router.get('/', users.index);
router.post('/', users.create);
router.get('/:id', users.show);
router.post('/login', users.login);
router.post('/checkEmail', users.checkEmail);
router.post('/:id/certificate', users.uploadCertificate);
router.put('/:id/certificate/:certificateId', users.updateCertificate);
router.put('/:id', users.update);
router.delete('/:id', users.destroy);
router.put('/:id/recovery', users.recovery);
router.post('/:id/recovery', users.checkRecovery);

module.exports = router;
