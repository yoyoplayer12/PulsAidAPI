const express = require('express');
const router = express.Router();
const emergencies = require('../../../controllers/api/v1/emergencies.js');

router.get('/', emergencies.index);
router.post('/', emergencies.create);
router.get('/:id', emergencies.show);
router.put('/:id', emergencies.update);
router.get('/amount/:id', emergencies.amount);
router.patch('/addHelper/:id', emergencies.addHelper);//give emergencyid and userid in body
module.exports = router;