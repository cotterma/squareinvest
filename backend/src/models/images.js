const Sequelize = require('sequelize')
const db = require('./database.js')
const annonces = require('./annonces.js')

const images = db.define('images', {
    id_annonce : {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: annonces,
            key: 'id'
        }
    },
    path : {
        type: Sequelize.STRING,
        allowNull: false
    },
}, { timestamps: false })

images.sync()
  .then(() => console.log('images synchronized'))
  .catch((error) => console.error('Error synchronizing database: ', error));

module.exports = images
