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
// send mail
/*
      mailerSendImplementation(
        email,
        name,
        "Verify Account",
        htmlBodyTemplates.verifyTemplate(userId),
      ).then((res) => console.log(res))
        .catch((err) => console.log({ err }))
        */
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

function otpForgotPassword (otp) {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP - Aftib</title>
    <style>
        * {
            margin: 0px;
            padding: 0px;
        }
        body {
            font-family: Arial, Helvetica, sans-serif;
            text-align: center;
        }
        .heading-main{
            padding: 20px 20px;
            font-size: 30px;
            font-weight: bold;
            background-color: rgb(72, 72, 255);
            color: white;
            margin-bottom: 20px;
        }
        .footer {
            padding: 25px 5px;
            font-size: 0.75rem;
        }
        .otp-container, .otp-heading{
            padding: 25px 10px;
        }
        .otp-container p span {
            display: inline-block;
            border: 1px solid;
            padding: 15px;
            margin-left: 5px;
            border-radius: 5px;
            border-color: bisque;
        }
    </style>
</head>
<body>
    <div class="heading-main">Aftib Real Estate</div>
    <div>
        <h4 class="otp-heading"> YOUR OTP </h4>
        <div>
            Use this otp on our website to open the password reset function.
        </div>
        <div class="otp-container">
            <p><span>${otp[0]}</span><span>${otp[1]}</span><span>${otp[2]}</span><span>${otp[3]}</span></p>
        </div>
        <div class="footer">If you did not request for this mail, kindly ignore it. To report suspicious activities, kindly contact support on +2348136879589</div>
        <div class="footer">Aftib Real Estate</div>
    </div>
</body>
</html>`
}

function agentRequestEmailNotification (name) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP - Aftib</title>
    <style>
        * {
            margin: 0px;
            padding: 0px;
        }
        body {
            font-family: Arial, Helvetica, sans-serif;
            text-align: center;
        }
        .heading-main{
            padding: 20px 20px;
            font-size: 30px;
            font-weight: bold;
            background-color: rgb(72, 72, 255);
            color: white;
            margin-bottom: 20px;
        }
        .footer {
            padding: 25px 5px;
            font-size: 0.75rem;
        }
        .otp-container, .otp-heading{
            padding: 25px 10px;
        }
        .otp-container p span {
            display: inline-block;
            border: 1px solid;
            padding: 15px;
            margin-left: 5px;
            border-radius: 5px;
            border-color: bisque;
        }
    </style>
</head>
<body>
    <div class="heading-main">Aftib Real Estate</div>
    <div>
        <h4 class="otp-heading">Hi, ${name} </h4>
        <div>
            We have recieved your request to be an agent with Aftib Real Estate. Our admins would review your request and update you. That would take an estimated 1 - 24 hours.
        </div>
        <div class="footer">Contact Aftib Support On <a>+23498378273</a></div>
    </div>
</body>
</html>`
}


function agentRequestAdminEmailNotification () {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP - Aftib</title>
    <style>
        * {
            margin: 0px;
            padding: 0px;
        }
        body {
            font-family: Arial, Helvetica, sans-serif;
            text-align: center;
        }
        .heading-main{
            padding: 20px 20px;
            font-size: 30px;
            font-weight: bold;
            background-color: rgb(72, 72, 255);
            color: white;
            margin-bottom: 20px;
        }
        .footer {
            padding: 25px 5px;
            font-size: 0.75rem;
        }
        .otp-container, .otp-heading{
            padding: 25px 10px;
        }
        .otp-container p span {
            display: inline-block;
            border: 1px solid;
            padding: 15px;
            margin-left: 5px;
            border-radius: 5px;
            border-color: bisque;
        }
    </style>
</head>
<body>
    <div class="heading-main">Aftib Real Estate</div>
    <div>
        <h4 class="otp-heading">Hi, Admin</h4>
        <div>
            A prospective agent just made a request to be an Agent at aftib. Login to your dashboard to review the request.
        </div>
        <div class="footer">Contact Aftib Support On <a>+23498378273</a></div>
    </div>
</body>
</html>`
}

function newHotelClientMail(name){
    return `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP - Aftib</title>
            <style>
                * {
                    margin: 0px;
                    padding: 0px;
                }
                body {
                    font-family: Arial, Helvetica, sans-serif;
                    text-align: center;
                }
                .heading-main{
                    padding: 20px 20px;
                    font-size: 30px;
                    font-weight: bold;
                    background-color: rgb(72, 72, 255);
                    color: white;
                    margin-bottom: 20px;
                }
                .footer {
                    padding: 25px 5px;
                    font-size: 0.75rem;
                }
                .otp-container, .otp-heading{
                    padding: 25px 10px;
                }
                .otp-container p span {
                    display: inline-block;
                    border: 1px solid;
                    padding: 15px;
                    margin-left: 5px;
                    border-radius: 5px;
                    border-color: bisque;
                }
            </style>
        </head>
        <body>
            <div class="heading-main">Aftib Real Estate</div>
            <div>
                <h4 class="otp-heading">Hi, ${name} </h4>
                <div>
                    Your hotel has been submitted and would be approved soon should it pass our vetting process. Our admins would review your request and update you. That would take an estimated 1 - 24 hours.
                </div>
                <div class="footer">Contact Aftib Support On <a>+23498378273</a></div>
            </div>
        </body>
        </html>
`
}

function contactForm({email,name,message}){

return  `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border: 1px solid #dcdcdc;
        }
        .header {
            background-color: #007BFF;
            color: #fff;
            padding: 10px 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .content p {
            line-height: 1.5;
        }
        .content h2 {
            color: #007BFF;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #888;
        }
        .footer a {
            color: #007BFF;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Contact Form Submission</h1>
        </div>
        <div class="content">
            <h2>New Message from ${name}</h2>
            <p><strong>Sender's Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Real Estate Company. All rights reserved.</p>
            <p><a href="https://www.realestatecompany.com">www.realestatecompany.com</a></p>
        </div>
    </div>
</body>
</html>
`;
}

let htmlBodyTemplates = {
    verifyTemplate,
    otpForgotPassword,
    agentRequestAdminEmailNotification,
    agentRequestEmailNotification,
    newHotelClientMail,
    contactForm
};

module.exports = { htmlBodyTemplates, mailerSendImplementation };
