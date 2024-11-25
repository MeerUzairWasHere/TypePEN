interface SMTPConfig {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
}

const config: SMTPConfig = {
  host: "smtp.abc.email",
  port: 587,
  auth: {
    user: "user@example.com",
    pass: "mysecretpassword",
  },
};

export default config;
