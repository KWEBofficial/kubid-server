import { Router } from 'express';
import { prepareUpload, uploadImage } from './controller';
import multer from 'multer';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/');
  },
  filename: (req, file, cb) => {
    console.log(req.body.id);
    cb(null, `${req.body.id}.${file.mimetype.split('/')[1]}`);
  },
});
const upload = multer({ storage });

router.post('/prepare-upload', prepareUpload);
router.post('/upload', upload.single('image'), uploadImage);

export default router;
