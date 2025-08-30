require('dotenv').config()
const express = require('express');
const app = express();
const PORT = 3000;

const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const internshipRoutes = require('./routes/interships');
const initDB = require('./db/init');
const  cors = require("cors");
app.use(cors({
  origin: "http://localhost:5173", // your React app
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
initDB();

app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/internship', internshipRoutes);

app.get('/', (req, res) => {
  res.send('Express + SQLite API is running!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
