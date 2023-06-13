const status = require("http-status")
const has = require('has-keys')
const jws = require('jws')
const bcrypt = require("bcrypt")
require('mandatoryenv').load(['TOKENSECRET' , 'BCRYPT_SALT'])
const { TOKENSECRET, BCRYPT_SALT } = process.env
const userModel = require('../models/users.js')
const documentModel = require('../models/documents.js')
const messageModel = require('../models/messages.js')
const {Op} = require('sequelize')
const nodemailer = require('nodemailer');
const admins = require('../admins.js')

function isPasswordValid(password) { // At least 4 characters
  return /^[a-z | A-Z | 0-9 | ! | @ | # | $ | % | ^ | & | *]{4,}$/.test(password)
}

function isEmailValid(email) {
  // Expression régulière pour valider une adresse e-mail
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailRegex.test(email);
}

function isNameValid(username){
  return /^[a-z | A-Z | 0-9 | ! | @ | # | $ | % | ^ | & | *]{3,}$/.test(username)
}

function getJwsToken(email) {
  const token = jws.sign({
    header: { alg: 'HS256' },
    payload: email,
    secret: TOKENSECRET,
  })
  return token
}

async function hashPassword(password) {
  return await bcrypt.hash(password, Number.parseInt(BCRYPT_SALT))
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'squareinvest38@gmail.com',
    pass: 'nkqjnuknsdtsmhsl'
  }
});

const connecting = new Map();

module.exports = {
  async getLimitedUsers(req, res) {
    // #swagger.tags = ['User']
    // #swagger.summary = 'Gets every user username'
    const data = await userModel.findAll({ attributes: ['username'] })
    res.status(200).json({ status: true, message: 'Returning users', data })
  },

  async getAllUsers (req, res) {
    // #swagger.tags = ['User']
    // #swagger.summary = 'Gets every users informations'

    if (!admins.includes(req.authMail)){
      throw {code: status.FORBIDDEN, message: 'You are not allowed to collect all users data'}
    }

    const data = await userModel.findAll({ attributes: ['username','email'] })
    res.status(200).json({ status: true, message: 'Returning users', data })
  },

  async register(req, res){ 
    // #swagger.tags = ['User']
    // #swagger.summary = 'Registers a new user and returns a jws token'
    // #swagger.parameters['obj'] = { in: 'body.data', description:'Username and password', schema: { $username: 'xxLouisBidaultxx', $password: 'leboss'}}
    /* #swagger.responses[200] = {
         description: 'User registered, token returned',
         schema: {
             token : 'usertoken'
         }
    } */
    if (!has(req.data, ['username'])) throw {code: status.BAD_REQUEST, message: 'You must specify a username'}
    if (!has(req.data, ['email'])) throw {code: status.BAD_REQUEST, message: 'You must specify an email'}
    if (!has(req.data, ['password'])) throw {code: status.BAD_REQUEST, message: 'You must specify a password'}
    const username =  req.data.username
    const email = req.data.email.toLowerCase()
    const password = req.data.password
    const msgMail = req.data.msgMail
    if (!isNameValid(username)) throw {code: status.FORBIDDEN, message: 'Invalid username (at least 3 characters)'}
    if (!isEmailValid(email)) throw {code: status.FORBIDDEN, message: 'Invalid email'}
    if (!isPasswordValid(password)) throw {code: status.FORBIDDEN, message: 'Invalid password (at least 4 characters)'}
    const userRetrieved = await userModel.findOne({ where: {[Op.or]: [{ email: email }, { username: username }]}, attributes: ['email'] })
    if(userRetrieved) throw { code: 403, message: 'User with this email or username already exists' }
    const hashedPassword = await hashPassword(password)
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    connecting[email] = {randomNumber, username, email, hashedPassword, msgMail};
    setTimeout(() => {
      if (connecting[email]) {
        delete connecting[email];
      }
    }, 600000);

    const mailOptions = {
      from: `${"squareinvest38@gmail.com"}`,
      to: `${email}`,
      subject: `Confirmation de votre adresse mail`,
      text: `Votre code de confirmation est : ${randomNumber}`
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });


    res.status(200).json({ status: true, message: 'User registered, token returned'})
  },

  async confirmMail(req, res){
    // #swagger.tags = ['User']
    // #swagger.summary = 'Confirms the user email'
    /* #swagger.responses[200] = {
         description: 'User registered, token returned',
         schema: {
             token : 'usertoken'
         }
    } */
    if (!has(req.data, ['email'])) throw {code: status.BAD_REQUEST, message: 'You must specify an email'}
    if (!has(req.data, ['code'])) throw {code: status.BAD_REQUEST, message: 'You must specify a code'}
    const email = req.data.email.toLowerCase()
    const code = req.data.code
    if (connecting[email].randomNumber != code) throw {code: status.FORBIDDEN, message: 'Invalid code'}
    const user = await userModel.create({ username: connecting[email].username, email: connecting[email].email, password: connecting[email].hashedPassword, msgMail: connecting[email].msgMail })
    connecting.delete(email)
    const token = getJwsToken(email)

    res.status(200).json({ status: true, message: 'User registered, token returned', data :token})
  },

  async login(req, res){
    // #swagger.tags = ['User']
    // #swagger.summary = 'Logs the user'
    // #swagger.parameters['obj'] = { in: 'body.data', description:'Username and password', schema: { $username: 'xxLouisBidaultxx', $password: 'leboss'}}
    /* #swagger.responses[200] = {
        description: 'User logged in, returning token',
        schema: {
            token : 'usertoken'
        }
    } */
    if (!has(req.data, ['email'])) throw {code:400, message: 'You must specify an email'}
    if (!has(req.data, ['password'])) throw {code:400, message: 'You must specify a password'}
    const email =  req.data.email.toLowerCase()
    const password = req.data.password
    const userRetrieved = await userModel.findOne({ where: {email : email}, attributes: ['username', 'email', 'password'] })
    if (!userRetrieved) throw {code: 403, message: 'User not found'}
    if (!await bcrypt.compare(password, userRetrieved.password)) throw {code: 403, message: 'Incorrect password'}
    const token = getJwsToken(email)
    const username = userRetrieved.username
    res.status(200).json({ status: true, message: 'User logged in, returning token', data : {username, token}})
  },

  async whoami(req, res){
    // #swagger.tags = ['User']
    // #swagger.summary = 'Returns the user'
    /* #swagger.responses[200] = {
        description: 'User found, returning username and email',
        schema: {
            username : 'xxLouisBidaultxx',
            email : 'truc@email'
        }
    } */
    const email = req.authMail
    const userRetrieved = await userModel.findOne({ where: {email : email}, attributes: ['username', 'email'] })
    if (!userRetrieved) throw {code: 403, message: 'User not found'}
    const username = userRetrieved.username
    res.status(200).json({ status: true, message: 'User found, returning username and email', data : {username, email}})
  },

  async deleteUser(req,res){
    // #swagger.tags = ['User']
    // #swagger.summary = 'Delete a user'
    /* #swagger.responses[200] = {
        description: 'User deleted'
    } */
    const loggedInUserEmail = req.authMail;
    const userToDeleteEmail = req.params.email;

    const userToDelete = await userModel.findOne({ where: { email: userToDeleteEmail } });
    const userToDeleteUsername = userToDelete.username;

    // Only allow deletion if the logged-in user is an admin
    if (!admins.includes(loggedInUserEmail)) {
      if (loggedInUserEmail !== userToDeleteEmail){
        throw { code: 403, message: 'You are not allowed to delete this user' };
      }
    }

    // Delete messages associated with the user
    await messageModel.destroy({ where: { 
      [Op.or]: [{ expediteur: userToDeleteUsername }, { destinataire: userToDeleteUsername}],
    } });

    // Delete documents associated with the user
    await documentModel.destroy({ where: { email: userToDeleteEmail } });

    // Delete the user
    const deletedUserCount = await userModel.destroy({ where: { email: userToDeleteEmail } });
    if (deletedUserCount === 0) {
      throw { code: 404, message: 'User not found' };
    }

    res.status(200).json({ status: true, message: 'User deleted' });
  },

  async updateMail(req,res){
    // #swagger.tags = ['User']
    // #swagger.summary = 'Update the mail of a user'
    /* #swagger.responses[200] = {
        description: 'Mail updated'
    } */
    const loggedInUserEmail = req.authMail;
    const newEmail = req.data.newEmail;

    if (!isEmailValid(newEmail)) throw {code: status.FORBIDDEN, message: 'Invalid new email'}

    const already_mail = await userModel.findOne({ where: { email: newEmail } });
    if (already_mail) throw { code: 403, message: 'Email already used' };

    const user_retrieved = await userModel.update({ email: newEmail }, { where: { email: loggedInUserEmail } });
    
    if (user_retrieved[0] === 0) {
      throw { code: 404, message: 'User not found' };
    }

    const new_token = getJwsToken(newEmail);

    res.status(200).json({ status: true, message: 'Mail updated', data : new_token});
  },

  async updatePassword(req,res){
    // #swagger.tags = ['User']
    // #swagger.summary = 'Update the password of a user'
    /* #swagger.responses[200] = {
        description: 'Password updated'
    } */
    const loggedInUserEmail = req.authMail;
    const oldPassword = req.data.oldPassword;
    const newPassword = req.data.newPassword;

    if (!isPasswordValid(newPassword)) throw {code: status.FORBIDDEN, message: 'Invalid new password'}

    const user_retrieved = await userModel.findOne({ where: { email: loggedInUserEmail }, attributes: ['password'] });

    if (!await bcrypt.compare(oldPassword, user_retrieved.password)) throw {code: 403, message: 'Wrong password'};

    const hashedPassword = await hashPassword(newPassword);

    await userModel.update({ password: hashedPassword }, { where: { email: loggedInUserEmail } });

    res.status(200).json({ status: true, message: 'Password updated' });
  },

  async updatePref(req,res){
    // #swagger.tags = ['User']
    // #swagger.summary = 'Update the preferences of a user'
    /* #swagger.responses[200] = {
        description: 'Preferences updated'
    } */
    const loggedInUserEmail = req.authMail;
    const newPref = req.data.newPref;

    await userModel.update({ msgMail: newPref }, { where: { email: loggedInUserEmail } });

    res.status(200).json({ status: true, message: 'Preferences updated' });
  }
  
}
