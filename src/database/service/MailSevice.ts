import nodemailer, { Transporter } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

class MailService {

    smtpConfig: SMTPTransport.Options
    transporter: Transporter<SMTPTransport.SentMessageInfo>

    constructor() {

        this.smtpConfig = {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: {
                user: process.env.ADMIN_MAIL,
                pass: process.env.PASSWORD_MAIL
            },
            tls: { rejectUnauthorized: false }
        }
        this.transporter = nodemailer.createTransport({ ...this.smtpConfig })
    }

    async sendMail(userMail: string, activationLink: string) {

        const link = process.env.HOST + '/activation/' + activationLink

        const mailOptions: Mail.Options = {
            from: process.env.ADMIN_MAIL,
            to: userMail,
            subject: 'Подтверждение регистрации',
            text: '',
            html: `
            <div>
                <h1>Для активации перейдите по ссылке</h1>
                <a href="${link}">${link}</a>
            </div>
        `,
        }

        await this.transporter.sendMail(mailOptions, (err, info: SMTPTransport.SentMessageInfo) => {
            if (err) {
                console.log(err);
                throw new Error('Error send message')
            }
            /*console.log(info.accepted, info.rejected, info.pending);
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));*/

            return {
                'Message sent:': info.messageId,
            }
        });

    }
}

export default new MailService()