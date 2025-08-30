const express = require('express');
const router = express.Router();
const { addIntership,getInternships, removeInternship,updateInternship} = require('../controllers/intershipController');

router.post('/',addIntership);
router.get('/', getInternships);
router.put('/:id', updateInternship);
router.delete('/:id', removeInternship);

module.exports = router;