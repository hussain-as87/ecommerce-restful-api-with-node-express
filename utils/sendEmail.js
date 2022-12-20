import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport'

// Nodemailer
const sendEmail = async (options) => {
    // 1) Create transporter ( service that will send email like "gmail","Mailgun", "mialtrap", sendGrid)
    const transporter = nodemailer.createTransport(smtpTransport({
        service: process.env.EMAIL_SERVICE,
        port: process.env.EMAIL_PORT, // if secure false port = 587, if true port= 465
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    }));

    // 2) Define email options (like from, to, subject, email content)
    const mailOpts = {
        from: 'adda77mad@gmail.com',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // 3) Send email
    await transporter.sendMail(mailOpts, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};


export default sendEmail; 