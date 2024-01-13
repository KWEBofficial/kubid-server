import { RequestHandler } from 'express';

export const getDepartments: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).json();
  } catch (error) {
    next(error);
  }
};
