const appointmentController = require('../appointmentcontroller');
const Appointment = require('../../infrastructure/mongodb/models/Appointment');

jest.mock('../../infrastructure/mongodb/models/Appointment');

describe('Booking Appointment', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        date: '2025-03-25',
        slot: '09:00 AM',
        name: 'ansh',
        email: 'ansh@example.com',
        phone: '1234567890',
        clinic: 'Dental Care',
        reason: 'teeth cleaning',
      },
      user: {
        id: 'mock-patient-id',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('should return 400 if any required fields are missing', async () => {
    req.body = { slot: '09:00 AM' }; 

    await appointmentController.book(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "All fields are required!" });
  });

  it('should return 400 if the slot is already booked', async () => {
    Appointment.findOne.mockResolvedValue({ slot: '09:00 AM' });

    await appointmentController.book(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "This time slot is already booked!" });
  });

  it('should return 201 and if  appointment  saved and still time slot is available', async () => {
    Appointment.findOne.mockResolvedValue(null);
    Appointment.prototype.save = jest.fn().mockResolvedValue({ _id: '12345' });

    await appointmentController.book(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: "Appointment booked successfully",
      appointment: expect.any(Object),
    }));
  });
});
