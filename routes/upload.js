const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const Image = require('../models/Image');
const fs = require('fs');

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, '/tmp'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });


router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log('Cloudinary upload result:', result);

    const newImage = await Image.create({
      filename: req.file.originalname,
      url: result.secure_url,
    });

    fs.unlinkSync(req.file.path); // remove temp file

    res.status(200).json({ message: 'Uploaded', data: newImage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all uploaded images
router.get('/images', async (req, res) => {
  const images = await Image.find().sort({ createdAt: -1 });
  res.json(images);
});

module.exports = router;
