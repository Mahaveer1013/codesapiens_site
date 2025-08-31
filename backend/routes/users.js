const express = require('express');
const router = express.Router();
const { addUser, getUsers,updateUser, removeUser,getUserById } = require('../controllers/userController');
const {verifyUser} = require('../middleware/authMiddleware.js');


router.post('/', addUser);
router.get('/', getUsers);
router.get(`/:id`,verifyUser, getUserById);
router.put(`/:id`, updateUser);
router.delete(`/:id`,removeUser);

module.exports = router;
