const Database = require('better-sqlite3');
const db = new Database('mydb.sqlite');

// Create table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    gender TEXT NOT NULL,
    age INTEGER NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    number INTEGER NOT NULL,
    college TEXT NOT NULL,
    city TEXT NOT NULL,
    qualification TEXT NOT NULL,
    specialization TEXT NOT NULL,
    currentYear InTEGER NOT NULL,
    github TEXT NOT NULL,
    linkedin TEXT NOT NULL
  )
`).run();
db.prepare(`
  
    CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    number INTEGER NOT NULL,
    role TEXT NOT NULL
    )`).run();
    db.prepare(`
    CREATE TABLE IF NOT EXISTS internships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    stipend INTEGER NOT NULL,
    eligibility TEXT NOT NULL,
    skills_required TEXT NOT NULL,
    application_link TEXT NOT NULL,
    posted_on TEXT NOT NULL,
    application_deadline TEXT NOT NULL,
    category TEXT NOT NULL,
    duration TEXT NOT NULL,
    perks TEXT NOT NULL,
    work_type TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    status TEXT NOT NULL
    )`).run();

module.exports = db;
