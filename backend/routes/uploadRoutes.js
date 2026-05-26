import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
const router = express.Router();

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send(`/${req.file.path.replace(/\\/g, '/')}`);
});

export default router;
