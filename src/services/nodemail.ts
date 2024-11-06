
import { mailOption } from './util';
import logger from '../logger';
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  secure: false,
  auth: {
      user: 'smtp@mailtrap.io',
      pass: 'f8e6edcf44ec885b96b0b9e35db5b2cb'
  }
});

export const sendEmail = async (authCode: string, recipient: string) => {
  try{
    const mailOptions = mailOption(authCode, recipient);
    const info = await transporter.sendMail(mailOptions)
    logger.info('message sent:', info.messageId);
  }
  catch(err:any){
    logger.error('Error while sending mail', err.message)
  }
};