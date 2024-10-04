const status = require("http-status")
const has = require('has-keys')
const annonceModel = require('../models/annonces.js')
const imageModel = require('../models/images.js')
const admins = require('../admins.js')
const db = require('../models/database.js')
const { Storage } = require('@google-cloud/storage');

const fileCrypted =
    "986e8fe477ca2bcf41fab1a7fdace1bcf3c54e4a62fbe60b3ae1d285281cd5d6e7127e194c8c21cb011923514163ccc8bb1c992fdbe9c5c4c6ee14cfa58936118cfbdffd5246311e4807d208bdb301497e28f84e18042374f79244c5abf4d8986deedee4062d424f1cb306193b2f894433817c1be3dfbb143ad2d7773c3a66f1024c9040443c3eb605d5edc6e19156deb7dc770d63bbad9a96f306f3d6694c17371d9f16871d3b2c75f77560f781ccb1f25c33329d8b6d7a924219502ba08c73b3e45113617fcaa950f62cc38f1baff66c0b4a60c8a8e3d737a07efcf1a08c4b17a969a2b65053e323f79d41e02af8675ed894c90855342b5ff5bc9d5a647611658410ba130c5b19e3d1ff2755bd0fce21d477b956a986f13406eb2430901515973f2b5984432457d63a0d8cb1a7494989d0ca971578d7777814e0922f40da96bb6dc4c9f47e03e1c1f25685f6c3b526ae952a9a87a624826530a2cf3b2c49d8d8a619f03e68b6d1296c04e9256fd2469b2c36d26474ea2acd72d56cd140537f25a4b0735689a82cd46afebfda97620b97b879133a1a67eea2ee095e59f0e302006e9d1948d45e8821a513b9f13339a46b07a3099938880ba46b74ca4f38690a0f1392f7e35e57534b760c631c6af92d230cf306aa2d8c4448a17bbd424d3d53c78f64153522e9430ed54fde3e6aad76c85a4dc2e5e6741dceded592d61266419fe6fa301588e7ac9ba857ba2912ec91ba13a96b5025f363fcd9b4dc0dd28446b2b90f481c043e60723ba0c21cc21c5317c5c9b3bb37258aa21b18795200eb55addf32f1c8da9d8e3ea64daec2c0444a0661b73c33e40f649b3856b756a9d7953624d14a471aba88963df708a9e014eb2501aaa0f99d544a7e1e1c4c11d447936ae066fd1956c0acfeab5bc8ccb9a9fd8cd572d1e7dffc0b07f726dcc2aec775dfce319ffa21ac69f5862653c3b53ba358076e1b411136cb64e34737ec041671ca4cd4bba8bdb01a3797ed2cd07bc642c557d943d98cd7ddb2073af93f76df8b5f4b1c40316f27d83c07fb8aab28b0bc961e473120cd82b86ef91504b3080456db431836d032e0c61ead2d2bcae052d97dbc1e83baeed067dfc2d7fc94189ccc0982737c86e9fbf8c072dd5bed7ead1cc965f8ecd211c2099035664135d6d36920c998e107d46f87bdde91199e5a33ce06e15e4eeaab319f22c3c07ad1951c0980c48fd6c4e9fa15f672181a6450f9b26c50278fb24c3f61a89c39c891f582f6d8b0c57d616a454759ce27a3df6d3b4e9ca59a399f405527c2919400683c97102347560a6f43acf5b0a95913b1986201110f482bf94305febe9196dae951265a7e20cdeb436796ded7f8738769ba8e76df395d439944b2f0b8cca2301118b3f979e1cc32cf0b30a964c6bb08a048f829eb79eedc447a000cbe97d64910769eb532c7b7af00697fb37543cb54c3fc4ab54be86a1b38278bbea486896fe326fb460411fb9afbd7df57b00336c10793466a08023da692e0d8360febb1015be908228157cfa9821f9e4f052fb8e594922ee38bbfd8b9677cac848352787ebbb877523aae83daf2ccf4d92911c0ebc7c4ecab77c16033fcabd8996e18f210c75945ba8fb3b8e85d6231e8d6d6336f5850fe045ea4d6c9f9ab13cb6642f94f785e01c64b4869f4ab683fe3f4a7c4d772cfa21caa6c4ea9dadeae4cf7455505d57f33904fcc2fd1cb2ac829fd405db617412d38e9c5592bb11608e6abb2a0f3ff0cbd9cb213ce92653671004316baefbe2ca1ae9ae227778a9e1643686be5dde57d61052c9cff1b7a16ab71f0a7b0afa4f358e2fff292ce92687b69e2bb6dd882a4d6393e5f8b26e2c188aa4672b29ab709b95461c28d10677f3a3b55b78634d2896dd0f71495ad68c49b6ed927289d807fcc107cc42be17fd261466d77911dc40d024510cbcfbf5b81e54ecaf1ea7d056af0ad7e07568d380b7fc86d8e505eff73223ce0ce2a074cf79028bb8d2edb1b884adb36d1242b2864412086849945f70d6a71d504625a9606b053af61b19ffcb917aedaf6c785425ad8b25ff6bdedfc8c6015cf8b43a19753b08bf17059250b11c75d3776e5549f43267e14f52535365bdb7af526d1350214ecc20afc5ccb67ba14877c890a2bddfa167e9b7b6ca88500e8583e5799ac402bc47b0f8d588468bed036bf279e7f06e7dc2521a7153ad6a4c325491eb3147f2c92de8893b9b96dd58fc0bbbe989eb781e38d11553c10157562c187e4045a369a5cbc66a1617af505fd6da1911dee2b150b2cd990e4fdec32ce18bc6ed329e441beee228d6b3ffb674d8801983c51d4c27e10db14b1b13e45f4fd9c391cd5c7916f3576d083e2c2a7f37f578a84d77bf2333e3da2ab0936867be010de106cda5f7c616d667ccbd904e652e642f5a7b64fd09a9ff62f27d2f31599c74d301de7ce2ff04939564138826f005add5eb96af25dab2becc4e9a8884d91828a7b620a941f171f0b4553663ea74b4c9238fdb45ac63413ebd959c11451c097d8f4e26f576dc6fab9a537cffe461975f6aa422ad9815a3048dbfdc297cc1f8eb1eab05ae60a08be16695eae93b954918196f802865a14c3fc17d95340882072eb95b21f88f26df342508a3c4ef5a983a57799f4df9ba0e419d33a450bb195295fc0e8aa15b1695c4938927dcb6331350cba2fd611c025a7ff7dbe44ccd169f53140c2b97d81d57d0a2a7e1b81bfc4c2e37144b9d0a2e22d97c9f825407e1d70e0496f9c199966317f11681bd86f886f6f8a77b902aa7625041d3254b6170f0c8c3b530a0fb4ea420ab5c885b8a959d1add66f45d1611536114cf4652bfd740a5f28ab1a3273687b055c2ac6ca233e60560257b3288f7a48bb5c12f3f44b5b49ed1f64d7a09c5f65e970780edf4fc81148b6c9d9ec3a336660e0b61651470ab5fed32d9bc9a62045568805a2f500243bd08ec1dad97d0a9371735d970346286b60e47932dbe0b7541c0992cdd17f7b497c059f453d483ace9e03678366a011f55adc7a0382fb7f7049261c80aac435be9a46ff3317986b00c8432636e7806ad86dc97c94f1a99c41a98aca9a496ae42401d232e5587bc2145ca871140bea686af87be2a851b0dc7e2ea07d5be5bb7f0b376f9fec7c4fcdc5c7b3366d0fb13a553da67850a316c86d53d2b5e46308ea031a40ef8e38b57261e53d828941113ddec6ac7b5a5a2d696865a7174613b315e5b3c43077ac96b3c87d1946abbd082f00dddf6d412f1bc51c3372d4b4c28498e95befce0d6673a49e929e92309c9dc754fe3160229e349285b4502a048a984827537443cab9bfc20e6079f8989e8331";

const key = Buffer.from(process.env.KEY.trim(), "hex");

function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv("aes-256-ecb", key, null);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

const decrypted = decrypt(fileCrypted);

const keyFile = JSON.parse(decrypted);
const storage = new Storage({ credentials: keyFile });
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
