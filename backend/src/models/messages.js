const Sequelize = require('sequelize')
const db = require('./database.js')

const messages = db.define('messages', {
	id : {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
	expediteur: {
		type: Sequelize.STRING,
		allowNull: false,
		references : {
			model : 'users',
			key : 'username'
		}
	},
	destinataire: {
		type: Sequelize.STRING,
		allowNull: false,
		references : {
				model : 'users',
				key : 'username'
		}
	},
	contenu :{
		type: Sequelize.TEXT,
		allowNull: false
	},
	time :{
		type: Sequelize.DATE,
		allowNull: false
	}
}, { timestamps: false })

messages.sync()
  .then(() => console.log('messages synchronized'))
  .catch((error) => console.error('Error synchronizing database: ', error));


module.exports = messages
