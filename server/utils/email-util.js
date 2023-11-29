// import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { emailReceivers } from './yml-util.js';

dotenv.config({ path: `${process.cwd()}/.env` });

export async function sendEmail(groupName, rule) {
  try {
    const receiversArr = emailReceivers.map((receiver) => receiver.target);
    const apiKey = process.env.EMAIL_API_KEY;
    const domain = process.env.EMAIL_DOMAIN;

    const mailgun = new Mailgun(FormData).client({
      username: 'api',
      key: apiKey,
    });

    const data = {
      from: 'no-reply@pulsetracker.com',
      to: receiversArr,
      subject: `System Alert: ${groupName}`,
      html: `
      <h1>Warning </h1>
      <p>Your system endpoint has been reached the below alerting rule.</p>
      <p>${rule}</p>
      <p>Please take appropriate actions to avoid any system performance issues or downtime.</p>
      <br />
      <br />
      <p>This is an automated message, please do not reply.</p>
      <p>Your IT Support Team</p>
      `,
    };
    await mailgun.messages.create(domain, data);
  } catch (error) {
    console.log(error);
  }
}

export default sendEmail;
