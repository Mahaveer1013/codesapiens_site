// db/postgresClient.js
const postgres = require('postgres');

// use the connection string from your .env (DATABASE_URL)
const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require', // Supabase requires SSL
});

module.exports = sql;
