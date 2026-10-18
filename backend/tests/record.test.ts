
import request from "supertest";
import mongoose from "mongoose";
// @ts-expect-error The test dependency may not provide TypeScript declarations.
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../app";

let mongo: MongoMemoryServer;
let token: string;
const app = createApp();

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  const reg = await request(app).post("/api/auth/register").send({
    name: "Rec", email: "rec@test.com", password: "secret1",
  });
  token = reg.body.token;
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe("Records", () => {
  it("creates a lent record", async () => {
    const res = await request(app)
      .post("/api/records")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "lent", personName: "Dawit", amount: 500,
        reason: "Lunch", date: new Date().toISOString(),
      });
    expect(res.status).toBe(201);
    expect(res.body.remaining).toBe(500);
  });

  it("handles partial repayment", async () => {
    const create = await request(app)
      .post("/api/records")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "lent", personName: "Sara", amount: 300, reason: "Taxi", date: new Date().toISOString() });
    const id = create.body._id;

    const repay = await request(app)
      .post(`/api/records/${id}/repay`)
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 100 });

    expect(repay.body.status).toBe("partial");
    expect(repay.body.remaining).toBe(200);
  });

  it("requires auth", async () => {
    const res = await request(app).get("/api/records");
    expect(res.status).toBe(401);
  });
});
