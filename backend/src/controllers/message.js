const status = require("http-status")
const has = require('has-keys')
const messageModel = require('../models/messages.js')
const userModel = require('../models/users.js')
const {Op} = require('sequelize')
const nodemailer = require('nodemailer');
const db = require('../models/database.js')
require("mandatoryenv").load(["GOOGLE_PASSWORD"]);


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'squareinvest38@gmail.com',
    pass: process.env.GOOGLE_PASSWORD
  }
});


module.exports = {
    async sendMsg (req, res) {
      // #swagger.tags = ['Message']
      // #swagger.summary = 'Send a message'
      const email = req.authMail; // Assuming the authenticated username is available in req.authMail
      const destinataire = req.body.destinataire;
      const contenu = req.body.contenu;

      const expediteur = await userModel.findOne({ where: {email: email}});
      const expediteur_username = expediteur.username;

      const destinataire_retrieved = await userModel.findOne({ where: { username: destinataire }})
      // Create the message entry in the database
      const date = new Date();
      const formatDate = date.toISOString(); // Convert to ISO 8601 format
      const query = `
        INSERT INTO ADMIN."messages" (
            "expediteur",
            "destinataire",
            "contenu",
            "time"
        ) VALUES (
            :EXPEDITEUR,
            :DESTINATAIRE,
            :CONTENU,
            TO_TIMESTAMP_TZ(:TIME, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"')
        );
      `;

      await db.query(query, {
        replacements: { EXPEDITEUR : expediteur_username, DESTINATAIRE : destinataire, CONTENU : contenu, TIME : formatDate},
      });

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
        order: [['id', 'ASC']]
      });
  
      res.status(200).json({ message: "Retrieving all the messages", data: messages });
    }
}
