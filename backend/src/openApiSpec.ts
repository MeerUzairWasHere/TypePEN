export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "TypePEN",
    version: "1.0.0",
    description:
      "A TypeScript-based backend starter with PostgreSQL, Express, and Node.js. Flexible and frontend-agnostic—connect with React, Angular, Vue, or any framework!",
    contact: {
      name: "Github Repository",

      url: "https://github.com/MeerUzairWasHere/TypePEN",
    },
  },
  servers: [
    // {
    //   url: "http://localhost:3000/api/v1",
    //   description: "Development server",
    // },
    {
      url: "https://typepen.onrender.com/api/v1",
      description: "Live Server",
    },
  ],
  paths: {
    "/auth/register": {
      post: {
        summary: "Register a new user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { example: "John Doe" },
                  email: { example: "john.doe@example.com" },
                  password: { example: "password123" },
                },
                required: ["name", "email", "password"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    msg: { type: "string" },
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "Login user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { example: "john.doe@example.com" },
                  password: { example: "password123" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/Token" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/logout": {
      delete: {
        summary: "Logout user",
        tags: ["Auth"],
        responses: {
          "200": {
            description: "Logout successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    msg: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/verify-email": {
      post: {
        summary: "Verify user email",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { example: "john.doe@example.com" },
                  verificationToken: { example: "12345dasdasdasdasdasd67890" },
                },
                required: ["email", "verificationToken"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Email verified successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    msg: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/forgot-password": {
      post: {
        summary: "Forgot password",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { example: "john.doe@example.com" },
                },
                required: ["email"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Password reset email sent or user not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    msg: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/reset-password": {
      post: {
        summary: "Reset password",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { example: "john.doe@example.com" },
                  token: { example: "12345dasdasdasdasdasd67890" },
                  newPassword: { example: "password12345" },
                },
                required: ["email", "token", "newPassword"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Password reset successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    msg: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/users/current-user": {
      get: {
        summary: "Get current user information",
        tags: ["Users"],
        responses: {
          "200": {
            description: "User information retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/users/updateUser": {
      patch: {
        summary: "Update user profile",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { example: "john.doe2@example.com" },
                  name: { example: "John Doe2" },
                },
                required: ["email", "name"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "User profile updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/users/updateUserPassword": {
      patch: {
        summary: "Update user password",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  oldPassword: { example: "password123" },
                  newPassword: { example: "password12345" },
                },
                required: ["oldPassword", "newPassword"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "User password updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    msg: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string" },
          role: { type: "string", default: "user" },
          verificationToken: { type: "string", nullable: true },
          isVerified: { type: "boolean", default: true },
          verified: { type: "string", format: "date-time", nullable: true },
          passwordToken: { type: "string", nullable: true },
          passwordTokenExpirationDate: {
            type: "string",
            format: "date-time",
            nullable: true,
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Token: {
        type: "object",
        properties: {
          id: { type: "integer" },
          refreshToken: { type: "string" },
          ip: { type: "string" },
          userAgent: { type: "string" },
          isValid: { type: "boolean", default: true },
          userId: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
};
