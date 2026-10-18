export const openapiDocument = {
  openapi: "3.0.3",
  info: {
    title: "MoneyNote API",
    version: "1.0.0",
    description: "API for tracking money lent, borrowed, and repaid.",
  },
  servers: [{ url: "http://localhost:5000", description: "Local development" }],
  tags: [
    { name: "Health", description: "Service status" },
    { name: "Auth", description: "Registration, login, and the current user" },
    { name: "Records", description: "Money lending and borrowing records" },
    { name: "Messages", description: "User notifications" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "507f1f77bcf86cd799439011" },
          name: { type: "string", example: "Abebe" },
          email: { type: "string", format: "email", example: "abebe@example.com" },
        },
      },
      Record: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { type: "string" },
          type: { type: "string", enum: ["lent", "borrowed"] },
          personName: { type: "string", example: "Dawit" },
          amount: { type: "number", format: "float", example: 500 },
          reason: { type: "string", example: "Lunch" },
          date: { type: "string", format: "date-time" },
          repaidAmount: { type: "number", example: 100 },
          remaining: { type: "number", example: 400 },
          status: { type: "string", enum: ["pending", "partial", "paid"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Message: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { type: "string" },
          title: { type: "string" },
          body: { type: "string" },
          read: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Error: {
        type: "object",
        properties: { message: { type: "string", example: "Invalid credentials" } },
      },
    },
  },
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Check that the API is running",
        responses: { "200": { description: "API is healthy" } },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", example: "Abebe" },
                  email: { type: "string", format: "email", example: "abebe@example.com" },
                  password: { type: "string", minLength: 6, example: "secret123" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "User registered and JWT returned" },
          "409": { description: "Email already registered" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "abebe@example.com" },
                  password: { type: "string", example: "secret123" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "JWT returned" },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get the authenticated user",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Current user" }, "401": { description: "Unauthorized" } },
      },
    },
    "/api/records": {
      get: {
        tags: ["Records"],
        summary: "List the authenticated user's records",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "type", in: "query", schema: { type: "string", enum: ["lent", "borrowed"] } },
          { name: "status", in: "query", schema: { type: "string", enum: ["pending", "partial", "paid"] } },
        ],
        responses: { "200": { description: "Record list" }, "401": { description: "Unauthorized" } },
      },
      post: {
        tags: ["Records"],
        summary: "Create a lending or borrowing record",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["type", "personName", "amount", "reason", "date"],
                properties: {
                  type: { type: "string", enum: ["lent", "borrowed"] },
                  personName: { type: "string", example: "Dawit" },
                  amount: { type: "number", exclusiveMinimum: 0, example: 500 },
                  reason: { type: "string", example: "Lunch" },
                  date: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Record created" }, "401": { description: "Unauthorized" } },
      },
    },
    "/api/records/summary": {
      get: {
        tags: ["Records"],
        summary: "Get totals for the authenticated user",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Financial summary" }, "401": { description: "Unauthorized" } },
      },
    },
    "/api/records/{id}": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      get: {
        tags: ["Records"],
        summary: "Get one record",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Record details" }, "404": { description: "Record not found" } },
      },
      put: {
        tags: ["Records"],
        summary: "Update a record",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  personName: { type: "string" },
                  amount: { type: "number", exclusiveMinimum: 0 },
                  reason: { type: "string" },
                  date: { type: "string", format: "date-time" },
                  repaidAmount: { type: "number", minimum: 0 },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Record updated" }, "404": { description: "Record not found" } },
      },
      delete: {
        tags: ["Records"],
        summary: "Delete a record",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Record deleted" }, "404": { description: "Record not found" } },
      },
    },
    "/api/records/{id}/repay": {
      post: {
        tags: ["Records"],
        summary: "Add a repayment to a record",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["amount"],
                properties: { amount: { type: "number", exclusiveMinimum: 0, example: 100 } },
              },
            },
          },
        },
        responses: { "200": { description: "Repayment recorded" }, "404": { description: "Record not found" } },
      },
    },
    "/api/messages": {
      get: {
        tags: ["Messages"],
        summary: "List the latest 50 messages",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Message list" } },
      },
    },
    "/api/messages/read-all": {
      patch: {
        tags: ["Messages"],
        summary: "Mark all messages as read",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Messages marked as read" } },
      },
    },
    "/api/messages/{id}/read": {
      patch: {
        tags: ["Messages"],
        summary: "Mark one message as read",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Message marked as read" }, "404": { description: "Message not found" } },
      },
    },
  },
} as const;
