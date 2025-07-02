const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const uploadRoutes = require('./routes/upload');

const authRoutes = require('./routes/authRoutes');
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://serajsnote.netlify.app",
  "https://apunp.netlify.app"
];

const corsOptions = {
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
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(cookieParser());

app.get("/", (_, res) => {
  res.json({ message: 'Health check successful!', allowedOrigins });
});

app.use('/api/auth', authRoutes);
app.use('/api', uploadRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
