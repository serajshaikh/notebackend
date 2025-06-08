const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, secure: false, maxAge: 86400000 });
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: 'Signup failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const isLocalhost = req.hostname === "localhost" || req.headers.origin?.includes("localhost");
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = createToken(user._id);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: !isLocalhost,
      sameSite: isLocalhost ? "Lax" : "None",
      maxAge: 86400000,
    });
    res.json({ message: 'Login successful', isLocalhost });
  } catch (err) {
    res.status(500).json({ error: 'Login error', err: JSON.stringify(err) });
  }
};


exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: 'Logged out' });
};

exports.getUser = (req, res) => {
  res.json({ user: req.user });
};
