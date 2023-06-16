import {back, admins} from "./config.js";
import { getUserDocs, openDocument } from "./document.js";
import { socket } from "./messagerie.js";

function login() {
  // Get the username and password from the form
  const email = document.querySelector("#email-login").value;
  const password = document.querySelector("#password-login").value;
  const body = new URLSearchParams();
  body.append("data", `{"email":"${email}", "password" : "${password}"}`);

  const url = back + "/login";

  // Send a POST request to the server
  fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response.json().then((error) => {
        throw error;
      });
    })
    .then((json) => {
      localStorage.setItem("token", json.data.token);
      localStorage.setItem("email", email);
      localStorage.setItem("username", json.data.username);
      refresh();
    })
    .catch((error) => {
      handleError(error);
    });
}

function confirm() {
  const url = back + "/confirmMail";
  const body = new URLSearchParams();
  const code = document.querySelector("#code").value;
  const email = localStorage.getItem("email");
  body.append("data", `{"email" : "${email}", "code":"${code}"}`);
  fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw response.json().then((error) => {
          throw error;
        });
      }
    })
    .then((json) => {
      localStorage.setItem("token", json.data);
      refresh();
    })
    .catch((error) => {
      handleError(error);
    });
}

function showConfirm() {
  document.querySelector(".register-form").classList.add("hidden");
  document.querySelector(".confirmation").classList.remove("hidden");
}

function unshowConfirm(){
  document.querySelector(".register-form").classList.remove("hidden");
  document.querySelector(".confirmation").classList.add("hidden");
}

function register() {
  // Get the username, email and password from the form
  const username = document.querySelector("#username-register").value;
  const email = document.querySelector("#email-register").value;
  const password = document.querySelector("#password-register").value;
  const msgMail = document.querySelector("#msgMail").checked;
  const body = new URLSearchParams();
  body.append(
    "data",
    `{"username":"${username}", "email" : "${email}", "password" : "${password}", "msgMail" : "${msgMail}"}`
  );

  const url = back + "/register";

  // Send a POST request to the server
  fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response.json().then((error) => {
        throw error;
      });
    })
    .then((json) => {
      localStorage.setItem("email", email);
      localStorage.setItem("username", username);
      showConfirm();
    })
    .catch((error) => {
      console.log(error);
      handleError(error);
    });
}

function showRestricted(email) {
  if (admins.includes(email)) {
    const admin = document.querySelector("#admin-main");
    admin.classList.remove("hidden");
  }
}

function showAccount(username) {
  const account = document.querySelector(".connected");
  account.classList.remove("hidden");
  const login = document.querySelector(".account");
  login.classList.add("hidden");
  // const account_main = document.querySelector("#show-account");
  // account_main.innerText = "Bonjour " + username;

  const disconnected = document.querySelectorAll(".disconnected");
  for (let element of disconnected) {
    element.classList.add("hidden");
  }
}

function handleError(error) {
  let message = error.message;
  if (message === "Invalid password (at least 4 characters)") {
    document.querySelector("#error-register").innerHTML =
      "Mot de passe invalide (au moins 4 caractères)";
  }
  if (message === "Invalid email") {
    document.querySelector("#error-register").innerHTML = "Email invalide";
  }
  if (message === "Invalid username (at least 3 characters)") {
    document.querySelector("#error-register").innerHTML =
      "Nom d'utilisateur invalide (au moins 3 caractères)";
  }
  if (message === "User not found") {
    document.querySelector("#error-login").innerHTML = "Email incorrect";
  }
  if (message === "Incorrect password") {
    document.querySelector("#error-login").innerHTML = "Mot de passe incorrect";
  }
  if (message === "User with this email or username already exists") {
    document.querySelector("#error-register").innerHTML =
      "Un utilisateur avec cet email ou nom existe déjà";
  }
  if (message === "Invalid new email") {
    document.querySelector("#error-edit-mail").innerHTML = "Email invalide";
  }
  if (message === "Invalid new password") {
    document.querySelector("#error-edit-password").innerHTML =
      "Nouveau mot de passe invalide";
  }
  if (message === "Wrong password") {
    document.querySelector("#error-edit-password").innerHTML =
      "Ancien mot de passe incorrect";
  }
  if (message === "Email already used") {
    document.querySelector("#error-edit-mail").innerHTML = "Email déjà utilisé";
  }
}

async function whoAmI() {
  const url = back + "/auth_api/whoami";
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "x-access-token": token,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response.json().then((error) => {
        throw error;
      });
    })
    .then((json) => {
      return json;
    })
    .catch((error) => {
      console.log(error);
    });
  return res;
}

async function showWho() {
  const user = await whoAmI();
  localStorage.setItem("username", user.data.username);
  localStorage.setItem("email", user.data.email);
  showAccount(user.data.username);
  // showRestricted(user.data.email);
}

async function getUsers() {
  const url = back + "/auth_api/users";
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
      }
      return response.json().then((error) => {
        throw error;
      });
    })
    .then(async (json) => {
      return json;
    })
    .catch((error) => {
      console.log(error);
    });
  return users;
}

async function setUserList() {
  const json = await getUsers();
  const list = document.querySelector("#liste-utilisateurs");
  list.innerHTML = "";
  for (let i = 0; i < json.data.length; i++) {
    const user = document.createElement("div");
    user.classList.add("utilisateur");

    const username = document.createElement("div");
    username.classList.add("utilisateur-title");
    username.innerText = json.data[i].username;
    user.appendChild(username);

    const email = document.createElement("div");
    email.classList.add("utilisateur-email");
    email.innerText = json.data[i].email;
    user.appendChild(email);

    const docs = await getUserDocs(json.data[i].email);
    for (let doc of docs.data) {
      const new_doc = document.createElement("button");
      new_doc.classList.add("utilisateur-doc");
      new_doc.setAttribute("path", `${back + "/auth_api/" + doc.path}`);
      new_doc.innerHTML = "Document";
      user.appendChild(new_doc);
    }

    const delete_button = document.createElement("button");
    delete_button.classList.add("utilisateur-delete");
    delete_button.setAttribute("email", json.data[i].email);
    delete_button.innerHTML = "Supprimer";
    user.appendChild(delete_button);

    const hr = document.createElement("hr");
    user.appendChild(hr);

    list.appendChild(user);
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  // socket.close()
  window.location.reload();
}

function refresh() {
  window.location.reload();
}

function deleteUser(email) {
  const url = back + "/auth_api/user/" + email;
  const token = localStorage.getItem("token");
  fetch(url, {
    method: "DELETE",
    headers: {
      "x-access-token": token,
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log("User deleted");
        refresh();
      }
      return response.json().then((error) => {
        throw error;
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function edit_mail() {
  const new_mail = document.querySelector("#new-mail").value;
  const url = back + "/auth_api/user/mail";
  const token = localStorage.getItem("token");
  const body = new URLSearchParams();
  body.append("data", `{"newEmail" : "${new_mail}"}`);
  fetch(url, {
    method: "PUT",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "x-access-token": token,
    },
    body,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response.json().then((error) => {
        throw error;
      });
    })
    .then((json) => {
      console.log("Mail changed");
      localStorage.setItem("email", new_mail);
      localStorage.setItem("token", json.data);
      refresh();
    })
    .catch((error) => {
      console.log(error);
      handleError(error);
    });
}

function editPassword() {
  const old_password = document.querySelector("#old-password").value;
  const new_password = document.querySelector("#new-password").value;
  const url = back + "/auth_api/user/password";
  const token = localStorage.getItem("token");
  const body = new URLSearchParams();
  body.append(
    "data",
    `{"oldPassword" : "${old_password}", "newPassword" : "${new_password}"}`
  );
  fetch(url, {
    method: "PUT",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "x-access-token": token,
    },
    body,
  })
    .then((response) => {
      if (response.ok) {
        console.log("Password changed");
        refresh();
      }
      return response.json().then((error) => {
        throw error;
      });
    })
    .catch((error) => {
      console.log(error);
      handleError(error);
    });
}

function editPref() {
  const pref = document.querySelector("#edit-pref").checked;
  const url = back + "/auth_api/user/pref";
  const token = localStorage.getItem("token");
  const body = new URLSearchParams();
  body.append("data", `{"newPref" : "${pref}"}`);
  fetch(url, {
    method: "PUT",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "x-access-token": token,
    },
    body,
  })
    .then((response) => {
      if (response.ok) {
        console.log("Pref changed");
        refresh();
      }
      return response.json().then((error) => {
        throw error;
      });
    })
    .catch((error) => {
      console.log(error);
      handleError(error);
    });
}

/* On document loading */
async function miseEnPlace() {
  if (localStorage.getItem("token") !== null) {
    try {
      await showWho();
      document
        .querySelector("#edit-mail")
        .addEventListener("click", function () {
          edit_mail();
        });
      document
        .querySelector("#edit-password")
        .addEventListener("click", function () {
          editPassword();
        });
      // document
      //   .querySelector("#edit-preference")
      //   .addEventListener("click", function () {
      //     editPref();
      //   });
      document
        .querySelector("#delete-account")
        .addEventListener("click", function () {
          deleteUser(localStorage.getItem("email"));
          logout();
        });
    } catch {
      logout();
    }
  }
  document.querySelector(".confirmation .back-button").addEventListener(
    "click",
    function () {
      unshowConfirm();
    },
    false
  );
  document.querySelector("#confirm").addEventListener(
    "click",
    function () {
      confirm();
    },
    false
  );
  document.querySelector("#logout").addEventListener(
    "click",
    function () {
      logout();
    },
    false
  );
  document.querySelector("#login").addEventListener(
    "click",
    function () {
      login();
    },
    false
  );
  document.querySelector("#register").addEventListener(
    "click",
    function () {
      register();
    },
    false
  );

  if (admins.includes(localStorage.getItem("email"))) {
    await setUserList();
    const docs = document.querySelectorAll(".utilisateur-doc");
    for (let i = 0; i < docs.length; i++) {
      docs[i].addEventListener(
        "click",
        function () {
          openDocument(docs[i].getAttribute("path"));
        },
        false
      );
    }

    const deletes = document.querySelectorAll(".utilisateur-delete");
    for (let i = 0; i < deletes.length; i++) {
      deletes[i].addEventListener(
        "click",
        function () {
          deleteUser(deletes[i].getAttribute("email"));
        },
        false
      );
    }
  }
}

window.addEventListener("load", miseEnPlace, false);
