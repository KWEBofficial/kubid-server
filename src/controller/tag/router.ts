import { Router } from 'express';
import { decodeToken } from '../auth/middleware';
import { createTag, deleteTag } from './controller';

const tagRouter = Router();

tagRouter.post('/', decodeToken, createTag);
tagRouter.delete('/:tagId', decodeToken, deleteTag);

export default tagRouter;
