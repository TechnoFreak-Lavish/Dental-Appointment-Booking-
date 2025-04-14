const Appointment = require('../../infrastructure/mongodb/models/Appointment');
const { getMyAppointments } = require('../appointmentcontroller');

jest.mock('../../infrastructure/mongodb/models/Appointment');

describe('getMyAppointments', () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 'mock-user-id' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should return appointments for the user', async () => {
    const mockData = [{ slot: '09:00 AM', date: '2025-03-25' }];
    Appointment.find.mockResolvedValue(mockData);

    await getMyAppointments(req, res);

    expect(Appointment.find).toHaveBeenCalledWith({ patientID: 'mock-user-id' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it('should return empty array if no appointments found', async () => {
    Appointment.find.mockResolvedValue([]);

    await getMyAppointments(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('should handle DB errors gracefully', async () => {
    Appointment.find.mockRejectedValue(new Error('DB error'));

    await getMyAppointments(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
  expect.objectContaining({ message: 'Error fetching appointments' })
);
  });
});
