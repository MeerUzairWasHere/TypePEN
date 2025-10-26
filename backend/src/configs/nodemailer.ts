type SMTPConfig = {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
};

type CompanyInfo = {
  name: string;
  email: string;
  website: string;
  address: string;
};

export const nodemailerConfig: SMTPConfig = {
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_SECRET!,
  },
};

export const emailDetaidls: CompanyInfo = {
  name: "TypePEN",
  email: "support@typepen.com",
  website: "https://typepen.com",
  address: "123 Type St, Education City, EC 12345",
};
