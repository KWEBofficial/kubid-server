import { RequestHandler } from 'express';

export const uploadImage: RequestHandler = async (req, res) => {
  return res.status(200).json({ message: 'upload image' });
};
