export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "TypePEN",
    version: "3.1.0",
    description:
      "A TypeScript-based backend starter with PostgreSQL, NestJS, and Node.js. Flexible and frontend-agnostic—connect with React, Angular, Vue, or any framework!",
    contact: {
      name: "Github Repository",
      url: "https://github.com/MeerUzairWasHere/TypePEN",
    },
  },
  servers: [
    {
      url: "https://typepen-hi81.onrender.com/api/v1",
      description: "Live Server",
    },
    {
      url: "http://localhost:3000/api/v1",
      description: "Development server",
    },
  ],
  tags: [
    {
      name: "Auth",
      description: "Authentication and password recovery endpoints",
    },
    {
      name: "Users",
      description: "Authenticated user profile endpoints",
    },
    {
      name: "Company",
      description: "Admin-only company configuration endpoints",
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
              schema: { $ref: "#/components/schemas/RegisterInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "409": { $ref: "#/components/responses/Conflict" },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "Login user",
        description:
          "Returns the authenticated token user and sets signed accessToken and refreshToken cookies.",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            headers: {
              "Set-Cookie": {
                description:
                  "Signed accessToken and refreshToken HTTP-only cookies.",
                schema: {
                  type: "string",
                  example:
                    "accessToken=eyJ...; Path=/; HttpOnly, refreshToken=eyJ...; Path=/; HttpOnly",
                },
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TokenUser" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthenticated" },
        },
      },
    },
    "/auth/logout": {
      delete: {
        summary: "Logout user",
        tags: ["Auth"],
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Logout successful",
            headers: {
              "Set-Cookie": {
                description:
                  "Expires accessToken and refreshToken HTTP-only cookies.",
                schema: {
                  type: "string",
                  example:
                    "accessToken=logout; Path=/; HttpOnly, refreshToken=logout; Path=/; HttpOnly",
                },
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthenticated" },
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
              schema: { $ref: "#/components/schemas/VerifyEmailInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Email verified successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthenticated" },
        },
      },
    },
    "/auth/forgot-password": {
      post: {
        summary: "Request a password reset email",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ForgotPasswordInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Password reset email sent or user not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
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
              schema: { $ref: "#/components/schemas/ResetPasswordInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Password reset successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/users/current-user": {
      get: {
        summary: "Get current user information",
        tags: ["Users"],
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Current authenticated user",
            content: {
              "application/json": {
                schema: {
                  nullable: true,
                  allOf: [{ $ref: "#/components/schemas/TokenUser" }],
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthenticated" },
        },
      },
    },
    "/users/update-user": {
      patch: {
        summary: "Update user profile",
        tags: ["Users"],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserUpdateInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "User profile updated successfully",
            headers: {
              "Set-Cookie": {
                description: "Refreshes the signed accessToken cookie.",
                schema: {
                  type: "string",
                  example: "accessToken=eyJ...; Path=/; HttpOnly",
                },
              },
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/TokenUser" },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthenticated" },
        },
      },
    },
    "/users/update-user-password": {
      patch: {
        summary: "Update user password",
        tags: ["Users"],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdatePasswordInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "User password updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthenticated" },
        },
      },
    },
    "/company": {
      post: {
        summary: "Create company configuration",
        description: "Requires an authenticated Admin or SuperAdmin user.",
        tags: ["Company"],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CompanyCreateInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Company created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Company" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthenticated" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "409": { $ref: "#/components/responses/Conflict" },
        },
      },
      get: {
        summary: "Get company configuration",
        description: "Requires an authenticated Admin or SuperAdmin user.",
        tags: ["Company"],
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Company configuration or null when not configured",
            content: {
              "application/json": {
                schema: {
                  nullable: true,
                  allOf: [{ $ref: "#/components/schemas/Company" }],
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthenticated" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
      delete: {
        summary: "Delete company configuration",
        description: "Requires an authenticated Admin or SuperAdmin user.",
        tags: ["Company"],
        security: [{ cookieAuth: [] }],
        responses: {
          "204": {
            description: "Company configuration deleted successfully",
          },
          "401": { $ref: "#/components/responses/Unauthenticated" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/company/{companyId}": {
      patch: {
        summary: "Update company configuration",
        description: "Requires an authenticated Admin or SuperAdmin user.",
        tags: ["Company"],
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "companyId",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CompanyUpdateInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Company configuration updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Company" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthenticated" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
          "409": { $ref: "#/components/responses/Conflict" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "accessToken",
        description:
          "Signed accessToken cookie. The refreshToken cookie can also re-issue credentials when the access token expires.",
      },
    },
    responses: {
      BadRequest: {
        description: "Invalid request or validation failure",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      Unauthenticated: {
        description: "Authentication failed or credentials are invalid",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      Forbidden: {
        description: "Authenticated user does not have permission",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      NotFound: {
        description: "Requested record was not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      Conflict: {
        description: "Duplicate value or resource conflict",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
    },
    schemas: {
      RegisterInput: {
        type: "object",
        required: ["name", "username", "email", "password"],
        properties: {
          name: {
            type: "string",
            minLength: 2,
            maxLength: 255,
            example: "John Doe",
          },
          username: {
            type: "string",
            minLength: 4,
            maxLength: 20,
            example: "johndoe",
          },
          email: {
            type: "string",
            format: "email",
            example: "john.doe@example.com",
          },
          password: {
            type: "string",
            format: "password",
            minLength: 8,
            maxLength: 20,
            example: "password123",
          },
        },
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "john.doe@example.com",
          },
          password: {
            type: "string",
            format: "password",
            example: "password123",
          },
        },
      },
      VerifyEmailInput: {
        type: "object",
        required: ["email", "verificationToken"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "john.doe@example.com",
          },
          verificationToken: {
            type: "string",
            example: "12345dasdasdasdasdasd67890",
          },
        },
      },
      ForgotPasswordInput: {
        type: "object",
        required: ["email"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "john.doe@example.com",
          },
        },
      },
      ResetPasswordInput: {
        type: "object",
        required: ["email", "token", "newPassword"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "john.doe@example.com",
          },
          token: {
            type: "string",
            example: "12345dasdasdasdasdasd67890",
          },
          newPassword: {
            type: "string",
            format: "password",
            minLength: 8,
            maxLength: 20,
            example: "password12345",
          },
        },
      },
      UserUpdateInput: {
        type: "object",
        minProperties: 1,
        properties: {
          name: {
            type: "string",
            minLength: 2,
            maxLength: 255,
            example: "John Doe2",
          },
          email: {
            type: "string",
            format: "email",
            example: "john.doe2@example.com",
          },
        },
      },
      UpdatePasswordInput: {
        type: "object",
        required: ["oldPassword", "newPassword"],
        properties: {
          oldPassword: {
            type: "string",
            format: "password",
            example: "password123",
          },
          newPassword: {
            type: "string",
            format: "password",
            minLength: 8,
            maxLength: 20,
            example: "password12345",
          },
        },
      },
      CompanyCreateInput: {
        type: "object",
        required: [
          "name",
          "address",
          "website",
          "phone",
          "email",
          "verified_resend_domain",
        ],
        properties: {
          name: {
            type: "string",
            minLength: 1,
            maxLength: 255,
            example: "TypePEN Inc.",
          },
          address: {
            type: "string",
            minLength: 1,
            maxLength: 255,
            example: "123 Main Street, San Francisco, CA",
          },
          website: {
            type: "string",
            format: "uri",
            maxLength: 255,
            example: "https://typepen.example.com",
          },
          phone: {
            type: "string",
            minLength: 1,
            maxLength: 255,
            example: "+1-555-0100",
          },
          email: {
            type: "string",
            format: "email",
            maxLength: 255,
            example: "support@typepen.example.com",
          },
          verified_resend_domain: {
            type: "string",
            minLength: 1,
            maxLength: 55,
            example: "typepen.example.com",
          },
        },
      },
      CompanyUpdateInput: {
        type: "object",
        minProperties: 1,
        properties: {
          name: {
            type: "string",
            minLength: 1,
            maxLength: 255,
            example: "TypePEN Inc.",
          },
          address: {
            type: "string",
            minLength: 1,
            maxLength: 255,
            example: "123 Main Street, San Francisco, CA",
          },
          website: {
            type: "string",
            format: "uri",
            maxLength: 255,
            example: "https://typepen.example.com",
          },
          phone: {
            type: "string",
            minLength: 1,
            maxLength: 255,
            example: "+1-555-0100",
          },
          email: {
            type: "string",
            format: "email",
            maxLength: 255,
            example: "support@typepen.example.com",
          },
          verified_resend_domain: {
            type: "string",
            minLength: 1,
            maxLength: 55,
            example: "typepen.example.com",
          },
        },
      },
      TokenUser: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "0f5e9ad4-347b-4f70-a5f7-c0fb49d4d27a",
          },
          name: { type: "string", example: "John Doe" },
          role: { $ref: "#/components/schemas/Role" },
          email: {
            type: "string",
            format: "email",
            example: "john.doe@example.com",
          },
          isVerified: { type: "boolean", example: true },
        },
      },
      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "0f5e9ad4-347b-4f70-a5f7-c0fb49d4d27a",
          },
          username: { type: "string", example: "johndoe" },
          name: { type: "string", example: "John Doe" },
          email: {
            type: "string",
            format: "email",
            example: "john.doe@example.com",
          },
          role: { $ref: "#/components/schemas/Role" },
          verificationToken: { type: "string", nullable: true },
          isVerified: { type: "boolean", example: true },
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
          id: {
            type: "string",
            format: "uuid",
            example: "84acac40-2ee3-49f9-994e-8ab90c6ee9db",
          },
          refreshToken: { type: "string" },
          ip: { type: "string" },
          userAgent: { type: "string" },
          isValid: { type: "boolean", default: true },
          userId: {
            type: "string",
            format: "uuid",
            example: "0f5e9ad4-347b-4f70-a5f7-c0fb49d4d27a",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Company: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "29a835dc-94ea-4a43-8b5d-54691a8a70e0",
          },
          name: { type: "string", example: "TypePEN Inc." },
          address: {
            type: "string",
            example: "123 Main Street, San Francisco, CA",
          },
          website: {
            type: "string",
            format: "uri",
            example: "https://typepen.example.com",
          },
          phone: { type: "string", example: "+1-555-0100" },
          email: {
            type: "string",
            format: "email",
            example: "support@typepen.example.com",
          },
          verified_resend_domain: {
            type: "string",
            example: "typepen.example.com",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Role: {
        type: "string",
        enum: ["SuperAdmin", "Admin", "User"],
        example: "User",
      },
      MessageResponse: {
        type: "object",
        properties: {
          msg: { type: "string", example: "Success" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          statusCode: { type: "integer", example: 400 },
          message: { type: "string", example: "Validation failed" },
          errors: {
            nullable: true,
            oneOf: [
              { type: "array", items: { type: "object" } },
              { type: "object" },
            ],
          },
          stack: {
            type: "string",
            nullable: true,
            description: "Only included in development responses.",
          },
        },
      },
    },
  },
};
