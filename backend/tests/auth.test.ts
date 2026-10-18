
import request from "supertest";
import mongoose from "mongoose";
// The package is loaded at runtime; suppress the missing declaration error when
// this test is type-checked in projects without its bundled typings.
// @ts-expect-error mongodb-memory-server may not expose declarations to this project
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../app";

let mongo: MongoMemoryServer;
const app = createApp();

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe("Auth", () => {
  it("registers a user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test", email: "t@test.com", password: "secret1",
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it("rejects duplicate email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test", email: "t@test.com", password: "secret1",
    });
    expect(res.status).toBe(409);
  });

  it("logs in", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "t@test.com", password: "secret1",
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
