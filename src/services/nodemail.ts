import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport"; // Explicitly import for SMTP options
import { google } from "googleapis";
import { mailOption } from './util';
import logger from '../logger';

const EMAIL = process.env.Nodemail_email;
const CLIENT_ID = process.env.Google_client_id;
const CLIENT_SECRET = process.env.Google_secret_key;
const REFRESH_TOKEN = process.env.google_refresh_token;

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  logger.info('credentails', EMAIL)
  logger.info('credentails',  CLIENT_ID)
  logger.info('credentails',  CLIENT_SECRET)
  logger.info('credentails',  REFRESH_TOKEN)
  
  const oauth2Client = new OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
  });

  const accessToken = await new Promise<string | null>((resolve, reject) => {
    oauth2Client.getAccessToken((err, token:any) => {
      if (err) {
        console.error("Error getting access token:", err.message);
        reject("Failed to get access token");
      }
      resolve(token);
    });
  });

  // Explicitly cast the transport options to SMTPTransport.Options
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: EMAIL,
      accessToken,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN
    }
  } as SMTPTransport.Options); // Cast to SMTPTransport.Options

  return transporter;
};

export const sendEmail = async (authCode: string, recipient: string) => {
  const mailOptions = mailOption(authCode, recipient);
  const emailTransporter = await createTransporter();
  await emailTransporter.sendMail(mailOptions);
};
