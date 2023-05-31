const status = require("http-status")
const has = require('has-keys')
const documentModel = require('../models/documents.js')
const admins = require('../admins.js')

module.exports = {
    async getDocumentsUser (req, res) {
        // #swagger.tags = ['Document']
        // #swagger.summary = 'Get all documents of the authentified user'
        const email = req.authMail; // Assuming the authenticated username is available in req.authMail
        const documents = await documentModel.findAll({ where: {email : email} });
        res.status(200).json({ message: "Retriving all the documents", data : documents });
    },

    async getUserDocument (req, res) {
        // #swagger.tags = ['Document']
        // #swagger.summary = 'Get a document of a user'
        const email = req.authMail; // Assuming the authenticated username is available in req.authMail
        
        if (!admins.includes(email)){
            throw new Error("You don't have access rights", status.FORBIDDEN)
        }
        
        const mail  = req.params.mail;
        const documents = await documentModel.findAll({ where: {email : mail} });
        res.status(200).json({ message: "Retriving all the documents of the user", data : documents });
    },

    async upload(req, res){
        // #swagger.tags = ['Document']
        // #swagger.summary = 'Upload a document'
        const email  = req.authMail; // Assuming the authenticated username is available in req.authMail
        const path = req.filePath;

        // Check if the user has more than 4 documents
        const alreadyExists = await documentModel.findAll({ where: {email : email} });
        if (alreadyExists.length >= 4) {
            throw new Error("You can't upload more than 4 documents", status.FORBIDDEN)
        }

        // Create the document entry in the database
        const document = await documentModel.create({ email, path });

        // Document created successfully
        res.status(200).json({ message: 'Document uploaded'});
    },

    async delete(req, res){
        // #swagger.tags = ['Document']
        // #swagger.summary = 'Delete a document'
        const email  = req.authMail; // Assuming the authenticated username is available in req.authMail
        const path = req.filePath;

        // Delete the document
        const deletedDocumentCount = await documentModel.destroy({ where: { email: email, path: path } });
        if (deletedDocumentCount === 0) {
            throw new Error("Document not found", status.NOT_FOUND)
        }

        // Document deleted successfully
        res.status(200).json({ message: 'Document deleted'});
    }
}
