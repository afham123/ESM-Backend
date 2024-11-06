const nodemailer = require('nodemailer');
async function main() {
    const transporter = nodemailer.createTransport({
        host: "live.smtp.mailtrap.io",
        port: 587,
        secure: false,
        auth: {
            user: 'smtp@mailtrap.io',
            pass: 'f8e6edcf44ec885b96b0b9e35db5b2cb'
        }
    });
    const info = await transporter.sendMail({
        from: "sales@mahavir-agencies.com",
        to: "afhamfardeen98@gmail.com",
        subject: "hello",
        text: "hello world",
        html: "<b>Hello world</b>"
    });
    console.log('message sent:', info.messageId);
}
main();
