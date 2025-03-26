const appointmentController = require('../appointmentcontroller');
const Appointment = require('../../infrastructure/mongodb/models/Appointment');

jest.mock('../../infrastructure/mongodb/models/Appointment');

describe("Appointment Controller - Additional Tests", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: { id: "mock-patient-id" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should return 400 if required fields are missing", async () => {
    req.body = { date: "2025-03-25" }; // missing other fields

    await appointmentController.book(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "All fields are required!",
    });
  });

  it("should return 400 if slot is already booked", async () => {
    req.body = {
      date: "2025-03-25",
      slot: "09:00 AM",
      name: "John",
      email: "john@example.com",
      phone: "1234567890",
      clinic: "Smile Dental",
      reason: "Toothache",
    };

    Appointment.findOne.mockResolvedValue({ slot: "09:00 AM" });

    await appointmentController.book(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "This time slot is already booked!",
    });
  });

  it("should return 200 with empty list if user has no appointments", async () => {
    Appointment.find.mockResolvedValue([]);

    await appointmentController.getMyAppointments(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("should return 500 on error while fetching appointments", async () => {
    Appointment.find.mockRejectedValue(new Error("DB error"));

    await appointmentController.getMyAppointments(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error fetching appointments",
      error: "DB error",
    });
  });
});
