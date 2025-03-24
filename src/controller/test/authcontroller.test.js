const authController = require('../../controller/authcontroller.js');
const Patient = require('../../infrastructure/mongodb/models/Patient.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../infrastructure/mongodb/models/Patient');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Login Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: 'p.lavish912@gmail.com',
        password: '8903@Lavish'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should return 404 if Patient is not found', async () => {
    Patient.findOne.mockResolvedValue(null);
  
    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  
    expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid Credentials' }); 
  });
  

  it('should return 400 if password is incorrect', async () => {
    Patient.findOne.mockResolvedValue({ password: 'hashedPassword' });
    bcrypt.compare.mockResolvedValue(false);
  
    await authController.login(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid Password' }); 
  });

  it('should return 200 with token if login is successful', async () => {
    const mockPatient = { _id: '12345', password: 'hashedPassword' };
    Patient.findOne.mockResolvedValue(mockPatient);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mocked-jwt-token');
  
    await authController.login(req, res);
  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
      token: 'mocked-jwt-token',
      user: expect.any(Object),
    }));
  });
});
