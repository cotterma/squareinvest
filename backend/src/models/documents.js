const Sequelize = require('sequelize')
const db = require('./database.js')
const users = require('./users.js')

const documents = db.define('documents', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    references : {
      model : users,
      key : 'email'
    }
  },
  path: {
    primaryKey: true,
    unique : true,
    type: Sequelize.STRING,
    allowNull: false
  }
}, { timestamps: false })

documents.sync()
  .then(() => console.log('documents synchronized'))
  .catch((error) => console.error('Error synchronizing database: ', error));

module.exports = documents
