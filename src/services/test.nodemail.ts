const nodemailer = require('nodemailer');

async function main() {
    const transporter = nodemailer.createTransport({
        host:"send.smtp.mailtrap.io",
        port: 587,
        secure : false,
        auth:{
            user: 'api',
            password : '068caca4a238ecbd78d9b5fa08390878'
        }
    })

    const info = await transporter.sendEmail({
        from : "hrjob2676@gmail.com",
        to: "afhamfardeen98@gmail.com",
        subject: "hello",
        text : "hello world",
        html: "<b>Hello world</b>"
    })

    console.log('message sent:',info.messageId);
}

main();