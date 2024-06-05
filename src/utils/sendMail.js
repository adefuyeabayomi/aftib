const nodemailer = require('nodemailer')
const G_USER = process.env.G_USER
const G_PASSWORD = process.env.G_PASSWORD

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: G_USER,
        pass: G_PASSWORD
    }
});


function createMailOption (reciever,mailSubject,htmlBody){
    return {
        from: `"Aftib" <${G_USER}>`, // sender address
        to: reciever, // list of receivers
        subject: mailSubject, // Subject line
        html: htmlBody // html body
    }
}

function verifyTemplate(userID){
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
                    background-color: #4CAF50;
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
                    background-color: #4CAF50;
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
                    <a href="http://localhost:8080/verify-email/${userID}" class="verification-button">Verify Email</a>
                    <p>If you did not sign up for this account, you can ignore this email.</p>
                </div>
                <div class="email-footer">
                    <p>&copy; 2024 Your Company. All rights reserved.</p>
                </div>
            </div>
        </body>
    </html>
`
}

let htmlBodyTemplates = {
    verifyTemplate
}

module.exports = {transporter,createMailOption,htmlBodyTemplates}


