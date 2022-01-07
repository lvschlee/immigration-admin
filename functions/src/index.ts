import * as functions from 'firebase-functions';
import { MailService } from '@sendgrid/mail';

export const sendEmail = functions.https.onRequest(
  async (request, response) => {
    const mailService = new MailService();

    mailService.setApiKey(
      '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'
    );

    const msg = {
      to: 'troinof@yandex.ru', // Change to your recipient
      from: 'invmag2020@gmail.com', // Change to your verified sender
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    try {
      functions.logger.info("START: send email");
      await mailService.send(msg);
      
      functions.logger.info("SUCCESS: send email");
    } catch(e) {
      functions.logger.error("FAIL: send email", e);
    }

    response.send('email sended');
  }
);
