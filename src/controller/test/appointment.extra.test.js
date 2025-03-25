const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../server");

afterAll(async () => {
  // Gracefully close the MongoDB connection after all tests
  await mongoose.connection.close();
});

describe("Appointment Controller - Additional Tests", () => {
  const token = "Bearer invalid.token.here"; // Replace with a real one for actual test

  it("should return 400 if required fields are missing in booking", async () => {
    const res = await request(app)
      .post("/api/appointment/book")
      .send({ date: "2025-03-25" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("All fields are required!");
  });

  it("should return 401 for unauthorized booking (no token)", async () => {
    const res = await request(app)
      .post("/api/appointment/book")
      .send({});
    expect(res.statusCode).toBe(401);
  });

  it("should return 401 for booking with invalid token", async () => {
    const res = await request(app)
      .post("/api/appointment/book")
      .set("Authorization", token)
      .send({});
    expect(res.statusCode).toBe(401);
  });

  it("should return 401 or 200 depending on auth for getMyAppointments", async () => {
    const res = await request(app)
      .get("/api/appointment/my-appointments")
      .set("Authorization", token);
    expect([200, 401]).toContain(res.statusCode);
  });
});
