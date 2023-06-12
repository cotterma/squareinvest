/* Pour info, ce point de départ est une adaptation de celui qui vous obtiendriez
en faisant npm create backend
issu du dépôt
<https://github.com/ChoqueCastroLD/create-backend/tree/master/src/template/js>
*/

// Load Enviroment Variables to process.env (if not present take variables defined in .env file)
require('mandatoryenv').load(['PORT', 'TOKENSECRET'])
const { PORT } = process.env
const { TOKENSECRET } = process.env


// Instantiate an Express Application
const app = require('./app')
const jws = require('jws');
const fs = require('fs');
const userModel = require('./models/users.js');
const messageModel = require('./models/messages.js');

// Open Server on selected Port
app.listen(
  PORT,
  () => console.info('Server listening on port ', PORT)
)

// // Configure WebSocket Server
// const WebSocket = require('ws');
// const credentials = {
//   cert: fs.readFileSync('public.pem'),
//   key: fs.readFileSync('private.pem')
// };
// const server = require('https').createServer(credentials);
// const wss = new WebSocket.Server({server});

// const clients = new Map();

// // WebSocket connection event
// wss.on('connection', (ws) => {
//   console.log('WebSocket client connected.');

//   clients.set(ws, { username: null });

//   // WebSocket message event
//   ws.on('message', async (message) => {
//     console.log('Received message:', message);

//     try{
//       const messageObj = JSON.parse(message);
//       const { type, data } = messageObj;
//       const { token } = data;

//       if (type =="connection"){
//         if (!jws.verify(token, "HS256", TOKENSECRET)) {
//           ws.send(JSON.stringify({ type: "error", data: "Invalid token" }));
//           ws.close();
//           return;
//         }
      
//         // User sending the token valid
//         const email = jws.decode(token).payload
//         const user = await userModel.findOne({ where: { email: email }})
//         if (!user) {
//           ws.send(JSON.stringify({ type: "error", data: "User not found" }));
//           ws.close();
//           return;
//         }

//         clients.set(ws, { username: user.username });
//         console.log(clients);
//       }
//       else if (type == "msg"){
//         const {destinataire, contenu, time} = data;
//         console.log(destinataire)
//         const destinataire_retrieved = await userModel.findOne({ where: { username: destinataire }})
//         if (!destinataire_retrieved) {
//           ws.send(JSON.stringify({ type: "error", data: "Destinataire not found" }));
//           return;
//         }

//         const new_message = await messageModel.create({ expediteur: clients.get(ws).username, destinataire, contenu, time });

//         const destinataireClient = [...clients].find(([client, { username }]) => username === destinataire);
//         if (destinataireClient) {
//           destinataireClient[0].send(JSON.stringify({ type: "msg", data: { expediteur: clients.get(ws).username, contenu, time } }));
//         }
//       }
//     }
//     catch(error){
//       console.log(error);
//     }
//   });

//   // WebSocket close event
//   ws.on('close', () => {
//     console.log('WebSocket client disconnected.');

//     clients.delete(ws);
//   });
// });

// server.listen(8080, () => {
//   console.log('Server listening on port 8080');
// }
// );