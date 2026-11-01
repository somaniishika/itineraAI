import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  private readonly logger = new Logger(SendGridService.name);

  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  async sendEmail({ to, subject, text, html }: { to: string; subject: string; text: string; html?: string }) {
    try {
      const msg = {
        to,
        from: process.env.SENDGRID_FROM_EMAIL!,
        subject,
        text,
        html,
      };
      await sgMail.send(msg);
      this.logger.log(`Email successfully sent to ${to} with subject "${subject}"`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
      // throw new Error(`Failed to send email to ${to}`);
    }
  }
}
