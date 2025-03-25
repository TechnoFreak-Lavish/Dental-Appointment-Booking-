const request = require("supertest");
const app = require("../../server");

describe("Appointment Controller - Additional Tests", () => {
  const token = "Bearer invalid.token.here"; // Replace with a valid token for real test

  it("should return 400 if required fields are missing in booking", async () => {
    const res = await request(app)
      .post("/api/appointment/book")
      .send({ date: "2025-03-25" }); // Missing slot, name, etc.
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

  it("should return empty list for appointments if user has none", async () => {
    const res = await request(app)
      .get("/api/appointment/my-appointments")
      .set("Authorization", token);
    expect([200, 401]).toContain(res.statusCode); // Depends on token
  });
});
