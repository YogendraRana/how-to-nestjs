import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class EmailService {
    constructor(
        private mailerService: MailerService,
    ) { }

    async sendEmail(sender: string, receiver: string, subject: string, html: string) {
        await this.mailerService.sendMail({
            from: `Mate ${sender}`,
            to: receiver,
            subject: subject,
            html: html,
        })
    }
}