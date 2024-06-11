const MAILER_SEND_API_KEY = process.env.MAILER_SEND_API_KEY;
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const mailerSend = new MailerSend({
  apiKey: MAILER_SEND_API_KEY,
});

const sentFrom = new Sender(
  "support@trial-z3m5jgry0zx4dpyo.mlsender.net",
  "Aftib",
);

async function mailerSendImplementation(
  clientEmail,
  clientName,
  subject,
  htmlTemplate,
) {
  const recipients = [new Recipient(clientEmail, clientName)];
  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(subject)
    .setHtml(htmlTemplate);
  return await mailerSend.email.send(emailParams);
}

function verifyTemplate(userID) {
  return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification Email</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 3px rgba(0,0,0,0.1);
                }
                .email-header {
                    background-color: #4517FB;
                    padding: 10px;
                    text-align: center;
                    color: white;
                    border-top-left-radius: 10px;
                    border-top-right-radius: 10px;
                }
                .email-content {
                    padding: 20px;
                }
                .email-footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #777777;
                }
                .verification-button {
                    display: inline-block;
                    padding: 10px 20px;
                    margin-top: 20px;
                    background-color: #4517FB;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h1>Verify Your Email</h1>
                </div>
                <div class="email-content">
                    <p>Hi there,</p>
                    <p>Thank you for signing up. Please click the button below to verify your email address:</p>
                    <a href="http://localhost:8080/auth/verify-email/${userID}" class="verification-button">Verify Email</a>
                    <p>If you did not sign up for this account, you can ignore this email.</p>
                </div>
                <div class="email-footer">
                    <p>&copy; 2024 Your Company. All rights reserved.</p>
                </div>
            </div>
        </body>
    </html>
`;
}

let htmlBodyTemplates = {
  verifyTemplate,
};

module.exports = { htmlBodyTemplates, mailerSendImplementation };
