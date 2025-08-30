const express = require('express');
const router = express.Router();
const {addAdmin,getAdmins,updateAdmin, removeAdmin} = require('../controllers/adminController');

router.post('/', addAdmin);
router.get('/', getAdmins);
router.put('/:id',updateAdmin);
router.delete('/:id',removeAdmin);

module.exports = router;