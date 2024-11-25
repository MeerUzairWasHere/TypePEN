import {
  createTestAccount,
  createTransport,
  Transporter,
  SendMailOptions,
} from "nodemailer";
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

  const transporter: Transporter = createTransport(config);

  const mailOptions: SendMailOptions = {
    from: '"John Doe" <john.doe@example.com>', // sender address
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
