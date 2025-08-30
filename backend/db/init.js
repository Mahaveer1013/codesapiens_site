// db/init.js
const sql = require("../db/postgresClient"); // your postgres connection

async function initDB() {
  try {
    // Admins table
    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        number TEXT,
        role TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("✅ admins table ready");

    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        uid TEXT PRIMARY KEY,
        display_name TEXT,
        email TEXT UNIQUE NOT NULL,
        phone_number TEXT,
        avatar TEXT,
        bio TEXT,
        college TEXT,
        github_url TEXT,
        linkedin_url TEXT,
        portfolio_url TEXT,
        skills TEXT[],
        role TEXT CHECK (role IN ('student','admin','mentor')) DEFAULT 'student',
        badges_earned INT DEFAULT 0,
        points INT DEFAULT 0,
        sessions_attended INT DEFAULT 0,
        volunteering_hours INT DEFAULT 0,
        admin_approved BOOLEAN DEFAULT FALSE,
        email_verified BOOLEAN DEFAULT FALSE,
        phone_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    console.log("✅ users table ready");

    // Trigger to auto-update updated_at
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `;

    await sql`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    `;

    await sql`
      CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();
    `;

    console.log("✅ users updated_at trigger ready");

  } catch (err) {
    console.error("❌ Error initializing database:", err.message || err);
  }
}

module.exports = initDB;
