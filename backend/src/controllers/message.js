const status = require("http-status")
const has = require('has-keys')
const messageModel = require('../models/messages.js')
const userModel = require('../models/users.js')
const {Op} = require('sequelize')
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'squareinvest38@gmail.com',
    pass: 'nkqjnuknsdtsmhsl'
  }
});


module.exports = {
    async sendMsg (req, res) {
      // #swagger.tags = ['Message']
      // #swagger.summary = 'Send a message'

      const email = req.authMail; // Assuming the authenticated username is available in req.authMail
      const destinataire = req.data.destinataire;
      const contenu = req.data.contenu;
      const time = req.data.time;

      const expediteur = await userModel.findOne({ where: {email: email}});
      const expediteur_username = expediteur.username;

      const destinataire_retrieved = await userModel.findOne({ where: { username: destinataire }})
      const new_msg = await messageModel.create({ expediteur: expediteur_username, destinataire: destinataire, contenu: contenu, time: time });
      
      if (destinataire_retrieved.msgMail == true){
        const mailOptions = {
          from: `${email}`,
          to: `${destinataire_retrieved.email}`,
          subject: `Message from ${email}`,
          text: `${contenu}`
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log(`Email sent: ${info.response}`);
          }
        });
      }

      res.status(200).json({ message: "Message sent"});
    },
    
    async getMsgs (req, res) {
      // #swagger.tags = ['Message']
      // #swagger.summary = 'Get all messages of the authentified user'
      const email = req.authMail; // Assuming the authenticated username is available in req.authMail
      const destinataire = req.params.username;
      const expediteur = await userModel.findOne({ where: {email: email}});
      const expediteur_username = expediteur.username;

      const messages = await messageModel.findAll({
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                { expediteur: expediteur_username },
                { destinataire: destinataire },
              ],
            },
            {
              [Op.and]: [
                { expediteur: destinataire },
                { destinataire: expediteur_username },
              ],
            },
          ],
        },
      });
  
      res.status(200).json({ message: "Retrieving all the messages", data: messages });
    }
}
