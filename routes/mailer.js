var nodemailer = require("nodemailer");



var transport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "pika@darktunes.com",
        pass: "userpass"
    }
});

// Sends mail
//transport.sendMail(mailOptions, callback);

var mailOptions = {
    from: "Pikachu ✔ <pika@darktunes.com>", // sender address
    to: "bar@blurdybloop.com, baz@blurdybloop.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world ✔", // plaintext body
    html: "<b>Hello world ✔</b>" // html body


