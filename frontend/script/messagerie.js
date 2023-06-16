import { back } from "./config.js";
let socket = null;
let current_user = null;

async function getContacts() {
  const url = back + "/auth_api/limitedusers";
  const token = localStorage.getItem("token");
  const users = await fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "x-access-token": token,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((error) => {
          throw error;
        });
      }
    })
    .then(async (json) => {
      return json;
    })
    .catch((error) => {
      console.log(error);
    });
  return users;
}

async function getMessages(username) {
  const url = back + "/auth_api/msg/" + username;
  const token = localStorage.getItem("token");
  const messages = await fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "x-access-token": token,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((error) => {
          throw error;
        });
      }
    })
    .then((json) => {
      return json;
    })
    .catch((error) => {
      console.log(error);
    });
  return messages;
}

async function sendMessage() {
  const username = document
    .querySelector("#send-message")
    .getAttribute("receiver");
  const message_input = document.querySelector("#write-message");
  const message = message_input.value;
  message_input.value = "";
  const url = back + "/auth_api/msg";
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("destinataire", username);
  formData.append("contenu", message);
  await fetch(url, {
    method: "POST",
    headers: {
      "x-access-token": token,
    },
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        console.log("Message sent");
        return response.json();
      }
      return response.json().then((error) => {
        throw error;
      });
    })
    .then((json) => {
      const messageObj = {
        type: "msg",
        data: {
          token: token,
          destinataire: username,
          contenu: message,
        },
      };

      const messages = document.querySelector("#messagerie-messages-list");
      addMessage(messageObj.data, messages, username);
      scrollToBottom();
    })
    .catch((error) => {
      console.log(error);
    });

  // Send the message as a JSON string
  // socket.send(JSON.stringify(messageObj));
}

async function showConversation(username) {
  const messages_retrieved = await getMessages(username);

  const contacts = document.querySelector(".messagerie-contacts");
  contacts.classList.add("hidden");

  const conversation = document.querySelector(".messagerie-messages");
  conversation.classList.remove("hidden");

  const title = document.querySelector(
    ".messagerie-messages .messagerie-title"
  );
  title.innerText = "Conversation avec " + username;

  const messages = document.querySelector("#messagerie-messages-list");
  messages.innerHTML = "";

  const send_button = document.querySelector("#send-message");
  send_button.setAttribute("receiver", username);

  for (let message of messages_retrieved.data) {
    addMessage(message, messages, username);
  }
  current_user = username;
  scrollToBottom();
}

function handleReceived(message) {
  if (current_user === message.expediteur) {
    const messages = document.querySelector("#messagerie-messages-list");
    addMessage(message, messages, message.expediteur);
    scrollToBottom();
  }
}

function addMessage(message, messages, username) {
  const div = document.createElement("div");
  if (message.expediteur === username) {
    div.classList.add("received");
    div.innerText = message.contenu;
    messages.appendChild(div);
  } else {
    div.classList.add("sent");
    div.innerText = message.contenu;
    messages.appendChild(div);
  }
}

async function setContacts() {
  const contacts = await getContacts();
  for (let contact of contacts.data) {
    if (contact.username === localStorage.getItem("username")) {
      continue;
    }
    const li = document.createElement("li");
    li.classList.add("messagerie-user");
    li.innerText = contact.username;
    li.addEventListener("click", () => {
      showConversation(contact.username);
    });
    document.querySelector("#messagerie-list").appendChild(li);
  }
}

function scrollToBottom() {
  const messagesList = document.getElementById("messagerie-messages-list");
  messagesList.scrollTop = messagesList.scrollHeight;
}

function miseEnPlace() {
  // if (localStorage.getItem("token")) {
  //   setContacts();

  //   const back_button = document.querySelector(
  //     ".messagerie-messages .back-button"
  //   );
  //   const message = document.querySelector("#send-message");
  //   back_button.addEventListener(
  //     "click",
  //     () => {
  //       const contacts = document.querySelector(".messagerie-contacts");
  //       contacts.classList.remove("hidden");

  //       const conversation = document.querySelector(".messagerie-messages");
  //       conversation.classList.add("hidden");
  //     },
  //     false
  //   );
  //   message.addEventListener(
  //     "click",
  //     () => {
  //       sendMessage();
  //     },
  //     false
  //   );

    // socket = new WebSocket("wss://localhost:8080");

    // socket.addEventListener('open', () => {
    //   console.log('Connected to WebSocket server.');

    //   const messageObj = {
    //     type : "connection",
    //     data : {
    //       token : localStorage.getItem("token")
    //     }
    //   };
    //   // Send a message to the server
    //   socket.send(JSON.stringify(messageObj));
    // });

    // socket.addEventListener('message', (message) => {
    //   message = JSON.parse(message.data)
    //   if(message.type == "error"){
    //     console.log(message)
    //   }
    //   else if(message.type == "msg"){
    //     handleReceived(message.data)
    //   }
    // })

    // socket.addEventListener('close', () => {
    //   console.log('Disconnected from WebSocket server.');
    // });

}

export { socket };

window.addEventListener("load", miseEnPlace, false);
