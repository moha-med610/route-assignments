import nodemailer from "nodemailer";
import { otpEmailTemplate } from "../utils/emailTemp.js";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ email, userName, otp }) => {
  await transport.sendMail({
    from: "Saraha App",
    to: email,
    subject: "Verification Code",
    html: otpEmailTemplate({
      userName,
      otpCode: otp,
      expiryMinutes: 5,
    }),
  });
};
