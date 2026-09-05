import nodemailer from 'nodemailer'
import { SETTINGS } from '../../settings/config.js'

export class EmailService {
  async sendEmail({
    to,
    subject,
    text,
  }: {
    to: string
    subject: string
    text: string
  }) {
    // клиент SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SETTINGS.GMAIL_USER, // email откуда мы отправляем письма
        pass: SETTINGS.GMAIL_APP_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: SETTINGS.GMAIL_USER,
      to,
      subject,
      html: text,
    })
  }
}
