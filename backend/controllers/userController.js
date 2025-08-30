const { createUser, getAllUsers, updateOneUser, deleteUser } = require('../models/userModel');

// Add user
const addUser = async (req, res) => {
  try {
    const userData = req.body;
    const result = await createUser(userData);
    res.status(201).json(result);
    console.log(`User added: ${result.display_name || result.name}`);
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error: error.message });
    console.error("Error adding user:", error);
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
    console.log('Retrieved all users');
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
    console.error("Error fetching users:", error);
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const updates = req.body;
    const result = await updateOneUser(uid, updates);
    if (!result) {
      res.status(404).json({ message: "User not found" });
      console.log(`User with uid ${uid} not found`);
      return;
    }
    res.status(200).json({ message: "User updated successfully", user: result });
    console.log(`User with uid ${uid} updated successfully`);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
    console.error(`Error updating user with uid ${req.params.uid}:`, error);
  }
};

// Delete user
const removeUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await deleteUser(uid);
    if (!result) {
      res.status(404).json({ message: "User not found" });
      console.log(`User with uid ${uid} not found`);
      return;
    }
    res.status(200).json({ message: "User deleted successfully", user: result });
    console.log(`User with uid ${uid} deleted successfully`);
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
    console.error(`Error deleting user with uid ${req.params.uid}:`, error);
  }
};

module.exports = { addUser, getUsers, updateUser, removeUser };
