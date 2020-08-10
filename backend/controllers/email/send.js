const nodemailer = require('nodemailer');

// The credentials for the email account you want to send mail from mailtrap
const credentials = {
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "384d9628f74671",
        pass: "13ba4c539f1ecb"
    }
};

const transporter = nodemailer.createTransport(credentials);

// exporting an 'async' function here allows 'await' to be used
// as the return value of this function.
module.exports = async (to, content) => {
    //from and to
    const contacts = {
        from: 'support@webnoticeboard.com',
        to: 'user@email.com',
        subject: "Index email address for Web Notice Board",
    };

    // Combining the content and contacts into a single object that can
    // be passed to Nodemailer.
    const email = Object.assign({}, content, contacts);

    // This file is imported into the controller as 'sendEmail'. Because
    // 'transporter.sendMail()' below returns a promise we can write code like this
    // in the contoller when we are using the sendEmail() function.
    //
    //  sendEmail()
    //   .then(() => doSomethingElse())
    //
    // If you are running into errors getting Nodemailer working, wrap the following
    // line in a try/catch. Most likely is not loading the credentials properly in
    // the .env file or failing to allow unsafe apps in your gmail settings.
    await transporter.sendMail(email);
};