import { ErrorRequestHandler } from 'express';
import { CustomError } from './customErrors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res
      .status(err.code)
      .json({ name: err.name, message: JSON.parse(err.message) });
  }

  return res.status(500).json({ message: 'Something Went Wrong', err });
};

export default errorHandler;
