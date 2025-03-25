const authController = require('../authcontroller');
const Patient = require('../../infrastructure/mongodb/models/Patient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../infrastructure/mongodb/models/Patient');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller - Success Cases Only', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    req.body = {
      name: 'New User',
      email: 'new@example.com',
      phone: '1234567890',
      password: 'securepass'
    };

    Patient.findOne.mockResolvedValue(null); // No existing user
    bcrypt.hash.mockResolvedValue('hashed_password');
    Patient.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue()
    }));

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it('should login successfully and return a token', async () => {
    req.body = {
      email: 'new@example.com',
      password: 'securepass'
    };

    Patient.findOne.mockResolvedValue({
      _id: 'mock-id',
      email: 'new@example.com',
      password: 'hashed_password'
    });

    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mocked_token');

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: 'mocked_token',
      user: {
        _id: 'mock-id',
        email: 'new@example.com',
        password: 'hashed_password'
      }
    });
  });
});
