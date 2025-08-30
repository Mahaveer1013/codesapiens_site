const express = require('express');
const router = express.Router();
const { addUser, getUsers,updateUser, removeUser } = require('../controllers/userController');
const {verifyUser} = require('../middleware/authMiddleware.js');


router.post('/', addUser);
router.get('/',verifyUser, getUsers);
router.put(`/:id`, updateUser);
router.delete(`/:id`,removeUser);

module.exports = router;
