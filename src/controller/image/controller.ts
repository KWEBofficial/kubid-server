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

    const imageId = Number(req.params.imageId);
    await ImageService.uploadImage(imageId, image.filename);
    const uploadedImage = await ImageService.getImageById(imageId);

    res.status(201).json({ result: uploadedImage });
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};
