const Sequelize = require('sequelize')
const db = require('./database.js')

const annonces = db.define('annonces', {
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titre : {
        type: Sequelize.TEXT,
        allowNull: false
    },
    description : {
        type: Sequelize.TEXT,
        allowNull: false
    },
    prix : {
        type: Sequelize.FLOAT,
        allowNull: false
    },
}, { timestamps: false })

annonces.sync()
  .then(() => console.log('annonces synchronized'))
  .catch((error) => console.error('Error synchronizing database: ', error));

module.exports = annonces
