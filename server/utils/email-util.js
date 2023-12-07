import nodemailer from 'nodemailer';
import { findUp } from 'find-up';
import dotenv from 'dotenv';
import { emailReceivers } from './yml-util.js';

const dotenvPath = await findUp('.env');
dotenv.config({ path: dotenvPath });

const transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: '587',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_TOKEN,
  },
});

const receiversArr = emailReceivers.map((receiver) => receiver.target);

export async function sendEmail(groupName, rule) {
  transporter.sendMail({
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
  }).then((info) => console.log({ info }))
    .catch((error) => console.error(error));
}

export default sendEmail;
