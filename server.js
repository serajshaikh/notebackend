const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

const allowedOrigins = [
  "http://localhost:5173", // Vite
  "https://serajsnote.netlify.app/" // ✅ NO trailing slash
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// app.options("*", cors()); // Handles preflight
app.use(express.json());
app.use(cookieParser());

app.get("/", (_, res) => {
  try {
    res.json({ message: 'Health check successful!', allowedOrigins });
  } catch (err) {
    res.status(500).json({ error: 'HealthCheck error' });
  }
})
app.use('/api/auth', authRoutes);
mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
