import { Router } from 'express';
import { uploadImage } from './controller';

const router = Router();

router.use('/upload', uploadImage);

export default router;
