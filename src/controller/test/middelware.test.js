const authMiddleware = require('../../port/middleware/authentication');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('authMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 401 if no token provided', () => {
    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
  });

  it('should return 401 for wrong token format', () => {
    req.headers.authorization = 'invalidtoken';

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token format incorrect' });
  });

  it('should return 403 for invalid token', () => {
    req.headers.authorization = 'Bearer faketoken';
    jwt.verify.mockImplementation(() => { throw new Error('invalid') });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid token' }));
  });

  it('should call next if token is valid', () => {
    req.headers.authorization = 'Bearer goodtoken';
    jwt.verify.mockReturnValue({ patientId: '123' });

    authMiddleware(req, res, next);

    expect(req.user).toEqual({ id: '123' });
    expect(next).toHaveBeenCalled();
  });
});
