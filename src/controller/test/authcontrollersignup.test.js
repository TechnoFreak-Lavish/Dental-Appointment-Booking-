const authController = require('../authcontroller.js');
const Patient = require('../../infrastructure/mongodb/models/Patient.js');
const bcrypt = require('bcryptjs');

jest.mock('../../infrastructure/mongodb/models/Patient');
jest.mock('bcryptjs');

describe('Signup Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: 'lavish',
        email: 'p.lavish912@gmail.com',
        password: '8903@Lavish'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should return 400 if patient already exists', async () => {
    Patient.findOne.mockResolvedValue({ email: 'p.lavish912@gmail.com' });

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Exist Account' }); 
  }); 

  it('should return 201 if patient is created successfully', async () => {
    Patient.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedPassword');
    const mockSave = jest.fn().mockResolvedValue({});
    Patient.mockImplementation(() => ({ save: mockSave }));

    await authController.register(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith('8903@Lavish', 10);
    expect(mockSave).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      token: expect.any(String),
      user: expect.any(Object),
    }));
  });
});
