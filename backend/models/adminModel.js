const sql = require('../db/postgresClient');

// CREATE
const createAdmin = async (name, email, password, number, role) => {
  try {
    const result = await sql`
      INSERT INTO admins (name, email, password, number, role)
      VALUES (${name}, ${email}, ${password}, ${number}, ${role})
      RETURNING *;
    `;
    return result;
  } catch (err) {
    console.error("Error creating admin:", err.message || err);
    throw err;
  }
};

// READ
const getAllAdmins = async () => {
  try {
    const result = await sql`
      SELECT * FROM admins;
    `;
    return result;
  } catch (err) {
    console.error("Error fetching admins:", err.message || err);
    throw err;
  }
};

// DELETE
const deleteAdmin = async (id) => {
  try {
    const result = await sql`
      DELETE FROM admins WHERE id = ${id}
      RETURNING *;
    `;
    return result;
  } catch (err) {
    console.error("Error deleting admin:", err.message || err);
    throw err;
  }
};

// UPDATE
const updateOneAdmin = async (id, name, email, password, number, role) => {
  try {
    const result = await sql`
      UPDATE admins
      SET name = ${name},
          email = ${email},
          password = ${password},
          number = ${number},
          role = ${role}
      WHERE id = ${id}
      RETURNING *;
    `;
    return result;
  } catch (err) {
    console.error("Error updating admin:", err.message || err);
    throw err;
  }
};

module.exports = { createAdmin, getAllAdmins, deleteAdmin, updateOneAdmin };
