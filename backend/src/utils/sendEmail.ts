import nodeMailer from "nodemailer";

interface EmailOptions {
    email: string;
    subject: string;
    message: string;
    emailIndex: number;
}

const sendEmail = async (options: EmailOptions) => {

    const credentials = [
        {
            email: process.env.SMTP_EMAIL_1,
            password: process.env.SMTP_PASSWORD_1
        },
        {
            email: process.env.SMTP_EMAIL_2,
            password: process.env.SMTP_PASSWORD_2
        },
        {
            email: process.env.SMTP_EMAIL_3,
            password: process.env.SMTP_PASSWORD_3
        },
        {
            email: process.env.SMTP_EMAIL_4,
            password: process.env.SMTP_PASSWORD_4
        },
        {
            email: process.env.SMTP_EMAIL_5,
            password: process.env.SMTP_PASSWORD_5
        },
        {
            email: process.env.SMTP_EMAIL_6,
            password: process.env.SMTP_PASSWORD_6
        },
        {
            email: process.env.SMTP_EMAIL_7,
            password: process.env.SMTP_PASSWORD_7
        },
        {
            email: process.env.SMTP_EMAIL_8,
            password: process.env.SMTP_PASSWORD_8
        }
    ]
    
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: credentials[options.emailIndex].email,
            pass: credentials[options.emailIndex].password,
        },
        secure: true,
    });

    const mailOptions = {
        from: credentials[options.emailIndex].email,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;