const authController = require('../authcontroller');
const Patient = require('../../infrastructure/mongodb/models/Patient');

jest.mock('../../infrastructure/mongodb/models/Patient');

describe('Auth Controller - Additional Tests', () => {
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

  it('should return 400 if required fields are missing during registration', async () => {
    req.body = { email: 'test@example.com' };

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 if user already exists', async () => {
    req.body = {
      name: 'Test',
      email: 'existing@example.com',
      phone: '1234567890',
      password: 'password123'
    };

    Patient.findOne.mockResolvedValue({ email: 'existing@example.com' });

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Exist Account' });
  });

  it('should return 404 if login email is not found', async () => {
    req.body = {
      email: 'notfound@example.com',
      password: 'any'
    };

    Patient.findOne.mockResolvedValue(null);

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid Credentials' });
  });

  it('should return 400 if login password is incorrect', async () => {
    req.body = {
      email: 'found@example.com',
      password: 'wrongpassword'
    };

    Patient.findOne.mockResolvedValue({
      email: 'found@example.com',
      password: '$2a$10$mockedhash' // will mismatch with bcrypt
    });

    // Mock bcrypt
    const bcrypt = require('bcryptjs');
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid Password' });
  });
});
