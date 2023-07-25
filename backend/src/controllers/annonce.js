const status = require("http-status")
const has = require('has-keys')
const annonceModel = require('../models/annonces.js')
const imageModel = require('../models/images.js')
const admins = require('../admins.js')
const db = require('../models/database.js')

const keyFile = 'square-387510-fe1d4124a8da.json'
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: keyFile });
const bucket_name = 'squareinvest38'

module.exports = {
    async getAnnonces (req, res) {
        // #swagger.tags = ['Annonce']
        // #swagger.summary = 'Get all annonces'
        const annonces = await annonceModel.findAll();
        const list = [];
        for (let i = 0; i < annonces.length; i++) {
            const element = annonces[i];
            const id = element.id;
            const titre = element.titre;
            const description = element.description;
            const prix = element.prix;
            const image = await imageModel.findOne({ where: { id_annonce: element.id } });
            const path = image.path;
            list.push({ id, titre, description, prix, path})
          }
        res.status(200).json({ message: "Retriving all the annonces", data : list });
    },
    
    async getAnnonce(req, res){
        // #swagger.tags = ['Annonce']
        // #swagger.summary = 'Get an annonce'
        const { id } = req.params;
        const annonce = await annonceModel.findOne({ where: { id } });
        const images = await imageModel.findAll({ where: { id_annonce: id } });
        const paths = [];
        for (let image of images) {
            paths.push(image.path);
        }
        res.status(200).json({ message: "Retriving the annonce", data : { id, titre: annonce.titre, description: annonce.description, prix: annonce.prix, paths } });
    },
    
    async newAnnonce(req, res){
        // #swagger.tags = ['Annonce']
        // #swagger.summary = 'Create a new annonce'
        const { titre, description, prix } = req.body;
        const paths  = req.filesPath;
        //VERIFY USER IS ADMIN
        // if (!admins.includes(req.authMail)){
        //     throw new Error("You are not allowed to create an annonce")
        // }

        // Create the annonce entry in the database
        const query = `
            INSERT INTO ADMIN."annonces" (
                "titre",
                "description",
                "prix"
            ) VALUES (
                :TITRE,
                :DESCRIPTION,
                :PRIX
            );
        `;
        
        await db.query(query, {
            replacements: { TITRE : titre, DESCRIPTION : description, PRIX : prix },
          });
          
        const annonce = await db.query(`SELECT MAX("id") AS max_id FROM ADMIN."annonces"`);
        const id_annonce = annonce[0][0].MAX_ID;

        for (let element of paths) {
            const image = await imageModel.create({ id_annonce, path : element });
        }

        // Annonce created successfully
        res.status(200).json({ message: 'Annonce created'});
    },

    async deleteAnnonce(req, res){
        // #swagger.tags = ['Annonce']
        // #swagger.summary = 'Delete an annonce'
        const { id } = req.params;
        
        //VERIFY USER IS ADMIN
        // if (!admins.includes(req.authMail)){
        //     throw new Error("You are not allowed to delete an annonce")
        // }

        // Delete the annonce entry in the database
        const image = await imageModel.destroy({ where: { id_annonce: id } });
        const annonce = await annonceModel.destroy({ where: { id } });

        // Annonce deleted successfully
        res.status(200).json({ message: 'Annonce deleted'});
    },

    async updateAnnonce(req, res){
        // #swagger.tags = ['Annonce']
        // #swagger.summary = 'Update an annonce'
        const { id } = req.params;
        const { titre, description, prix } = req.body;
        const paths  = req.filesPath;

        //VERIFY USER IS ADMIN
        // if (!admins.includes(req.authMail)){
        //     throw new Error("You are not allowed to update an annonce")
        // }

        // Update the annonce entry in the database
        const query = `UPDATE ADMIN."annonces" SET "titre" = :titre, "description" = :description, "prix" = :prix WHERE "id" = :id`;
        const [affectedRows] = await db.query(query, {replacements: {titre : titre, description : description, prix : prix, id : id}});

        if (affectedRows === 0) {
            // No rows were updated, the entry may not exist
            throw new Error("Annonce not found");
        }

        try {
            const images = await imageModel.findAll({ where: {id_annonce: req.params.id }})
            const bucket = storage.bucket(bucket_name);
            for (let i = 0; i < images.length; i++) {
              const file = bucket.file(images[i].path);
              const fileExists = await file.exists();
              if(fileExists[0] && !paths.includes(images[i].path)){
                await file.delete();
              }
            }          
        } catch (err) {
            throw new Error("Error while editing images");
        }

        const image = await imageModel.destroy({ where: { id_annonce: id } });

        for (let element of paths) {
            const image = await imageModel.create({ id_annonce: id, path : element });
        }

        // Annonce updated successfully
        res.status(200).json({ message: 'Annonce updated'});
    }
}
