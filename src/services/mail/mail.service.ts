import { Resend } from 'resend';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class MailService {
    constructor(private readonly config: ConfigService) { }

    private resend: Resend = new Resend(this.config.get<string>('RESEND_API_KEY'));

    async sendMail(sender: string, receiver: string, subject: string, html: string): Promise<void> {
        await this.resend.emails.send({
            from: `Mate <${sender}>`,
            to: receiver,
            subject: subject,
            html: html,
        });
    }
}