export class CustomError extends Error {
  public code: number;
  public name: string;

  constructor(code: number, name: string, message: string | object) {
    super(JSON.stringify(message));
    this.code = code;
    this.name = name;
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string | object) {
    super(400, 'BadRequestError', message);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string | object) {
    super(401, 'UnauthorizedError', message);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string | object) {
    super(403, 'ForbiddenError', message);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string | object) {
    super(404, 'NotFoundError', message);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string | object) {
    super(409, 'ConflictError', message);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string | object) {
    super(500, 'InternalServerError', message);
  }
}
