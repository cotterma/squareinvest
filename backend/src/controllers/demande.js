const status = require("http-status")
const has = require('has-keys')
const admins = require('../admins.js')
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'squareinvest38@gmail.com',
      pass: 'nkqjnuknsdtsmhsl'
    }
  });

module.exports = {
   async sendDemand(req, res){
        // #swagger.tags = ['Demande']
        // #swagger.summary = 'Send a demand'
        const nom = req.body.nom;
        const prenom = req.body.prenom;
        const email = req.body.email;
        const telephone = req.body.telephone;
        const message = req.body.message;

        const mailOptions = {
            from: `${email}`,
            to: `${admins[1]}`,
            subject: `Demande de location de ${nom} ${prenom}`,
            text: `Nom : ${nom} \nPrénom : ${prenom} \nEmail : ${email} \nTéléphone : ${telephone} \nMessage : ${message}`
        };
      
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.status(status.INTERNAL_SERVER_ERROR).json({message : "Erreur lors de l'envoi de la demande"});
        } else {
            console.log('Email sent: ' + info.response);
            res.status(status.OK).json({message :"Demande envoyée"});
        }
        });
   }
}
