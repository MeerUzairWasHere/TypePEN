import { sendEmail } from "./sendEmail";

interface ResetPasswordEmailParams {
  name: string;
  email: string;
  token: string;
  origin: string;
}

export const sendResetPasswordEmail = async ({
  name,
  email,
  token,
  origin,
}: ResetPasswordEmailParams): Promise<void> => {
  const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;

  const message = `<p>Please reset your password by clicking on the following link: 
  <a href="${resetURL}">Reset Password</a></p>`;

  await sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello, ${name}</h4>
    ${message}`,
  });
};
