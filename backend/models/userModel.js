// models/userModel.js
const sql = require('../db/postgresClient');
const supabase = require('../db/supabaseClient');

const createUser = async ({
  uid,
  displayName,
  email,
  phoneNumber = null,
  avatar = null,
  bio = null,
  college = '',
  githubUrl = null,
  linkedinUrl = null,
  portfolioUrl = null,
  skills = [],
  role = 'student',
  badgesEarned = 0,
  points = 0,
  sessionsAttended = 0,
  volunteeringHours = 0,
  adminApproved = false,
  emailVerified = false,
  phoneVerified = false,
}) => {
  try {
    const result = await sql`
      INSERT INTO users (
        uid, display_name, email, phone_number, avatar, bio, college,
        github_url, linkedin_url, portfolio_url, skills, role,
        badges_earned, points, sessions_attended, volunteering_hours,
        admin_approved, email_verified, phone_verified
      ) VALUES (
        ${uid}, ${displayName}, ${email}, ${phoneNumber}, ${avatar}, ${bio}, ${college},
        ${githubUrl}, ${linkedinUrl}, ${portfolioUrl}, ${skills}, ${role},
        ${badgesEarned}, ${points}, ${sessionsAttended}, ${volunteeringHours},
        ${adminApproved}, ${emailVerified}, ${phoneVerified}
      )
      RETURNING *;
    `;
    return result[0];
  } catch (err) {
    console.error('Error creating user:', err.message || err);
    throw err;
  }
};

const getAllUsers = async () => {
  try {
    const result = await sql`SELECT * FROM users;`;
    return result;
  } catch (err) {
    console.error('Error fetching users:', err.message || err);
    throw err;
  }
};
const fetchUserById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("uid", id)   // match UID
      .single();       // ensures only one row is returned

    if (error) {
      console.error("Error fetching user by ID:", error.message);
      return null;
    }

    return data; // user object
  } catch (err) {
    console.error("Unexpected error:", err);
    throw err;
  }
};


const updateOneUser = async (uid, updates) => {
  try {
    const fields = Object.keys(updates)
      .map((key) => `${sql.raw(key)} = ${updates[key]}`)
      .join(', ');

    const result = await sql`
      UPDATE users
      SET ${sql.raw(fields)}
      WHERE uid = ${uid}
      RETURNING *;
    `;
    return result[0];
  } catch (err) {
    console.error('Error updating user:', err.message || err);
    throw err;
  }
};

const deleteUser = async (uid) => {
  try {
    const result = await sql`
      DELETE FROM users
      WHERE uid = ${uid}
      RETURNING *;
    `;
    return result[0];
  } catch (err) {
    console.error('Error deleting user:', err.message || err);
    throw err;
  }
};

module.exports = { createUser, getAllUsers, updateOneUser, deleteUser ,fetchUserById };
