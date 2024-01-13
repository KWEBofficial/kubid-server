import { RequestHandler } from 'express';
import errorHandler from '../../util/errorHandler';
import { BadRequestError } from '../../util/customErrors';
import ImageService from '../../service/image.service';

export const prepareUpload: RequestHandler = async (req, res, next) => {
  try {
    const imageId = await ImageService.prepareUploadImage();
    res.status(201).json({ id: imageId });
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};

export const uploadImage: RequestHandler = async (req, res, next) => {
  try {
    const image = req.file;
    if (!image) throw new BadRequestError('이미지를 업로드해주세요.');

    await ImageService.uploadImage(Number(req.body.id), image.filename);
    res.status(201).json({ message: '이미지 업로드에 성공했습니다.' });
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};
