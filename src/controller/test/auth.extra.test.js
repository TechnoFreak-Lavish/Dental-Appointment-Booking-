const request = require("supertest");
const app = require("../../server");

describe("Auth Controller - Additional Tests", () => {
  it("should return 400 if trying to register with missing fields", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com"
    });
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 when registering with existing email", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "testduplicate@example.com",
      phone: "1234567890",
      password: "test123"
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "testduplicate@example.com",
      phone: "1234567890",
      password: "test123"
    });

    expect([400, 409]).toContain(res.statusCode);
  });

  it("should return 404 for login with unregistered email", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nonexistent@example.com",
      password: "any"
    });
    expect(res.statusCode).toBe(404);
  });

  it("should return 400 for login with wrong password", async () => {
    // First register
    await request(app).post("/api/auth/register").send({
      name: "Login Test",
      email: "login@example.com",
      phone: "9999999999",
      password: "correctPassword"
    });

    // Now try login with wrong password
    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "wrongPassword"
    });

    expect(res.statusCode).toBe(400);
  });
});
