const express = require('express');
const { signup, login, logout, getUser } = require('../controllers/authController');
const requireAuth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/apunsignup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, getUser);

module.exports = router;
