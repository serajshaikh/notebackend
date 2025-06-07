const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "https://notebackend-sable.vercel.app"
];

app.use(
  cors({
    origin: "*", 
    credentials: false,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
