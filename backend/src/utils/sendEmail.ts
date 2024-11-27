import { createTestAccount, createTransport } from "nodemailer";
import config from "./nodemailerConfig.js";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({
  to,
  subject,
  html,
}: EmailOptions): Promise<void> => {
  const testAccount = await createTestAccount();

  const transporter = createTransport(config);

  const mailOptions = {
    from: '"John Doe" <john.doe@example.com>', // sender address
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
