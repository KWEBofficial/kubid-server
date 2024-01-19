import { Router } from 'express';
import { prepareUpload, uploadImage } from './controller';
import multer from 'multer';
import fs from 'fs';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'images/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.imageId}.${file.mimetype.split('/')[1]}`);
  },
});
const upload = multer({ storage });

router.post('/prepare-upload', prepareUpload);
router.post('/upload/:imageId', upload.single('image'), uploadImage);

export default router;
