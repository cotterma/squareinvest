const Sequelize = require('sequelize')
const db = require('./database.js')

const users = db.define('users', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique : true,
  },
  email:{
    primaryKey: true,
    type: Sequelize.STRING,
    allowNull: false,
    unique : true,
  },
  password:{
    type: Sequelize.STRING,
    allowNull: false
  },
  msgMail:{
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, { timestamps: false })

users.sync()
  .then(() => console.log('users synchronized'))
  .catch((error) => console.error('Error synchronizing database: ', error));


module.exports = users
