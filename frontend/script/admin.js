import {back} from "./config.js"

function showAuth() {
  const espaceAdmin = document.getElementById("espace-admin");
  const menu= document.querySelector(".espace-menu")
  if (document.querySelector(".espace-menu .auth-field")) {
      menu.removeChild(document.querySelector(".espace-menu .auth-field"))
      menu.removeChild(document.querySelector(".espace-menu .auth-valid"))
      menu.removeChild(document.querySelector(".espace-menu #error-auth"))
    }
  else{
    const passwordField = document.createElement("input");
    passwordField.classList.add("auth-field");
    passwordField.setAttribute("type", "password");
    passwordField.setAttribute("id", "auth-password");
    passwordField.setAttribute("placeholder", "Mot de passe");
    const error = document.createElement("span");
    error.setAttribute("id", "error-auth");
    const passwordValid = document.createElement("button");
    passwordValid.classList.add("auth-valid");
    passwordValid.setAttribute("id", "auth-valid");
    passwordValid.textContent = "Valider";
    passwordValid.addEventListener(
      "click",
      function () {
        verifPass()
      },
      false
    );
    espaceAdmin.insertAdjacentElement("afterend", passwordValid);
    espaceAdmin.insertAdjacentElement("afterend", error);
    espaceAdmin.insertAdjacentElement("afterend", passwordField);
  }
}

function verifPass(){
  const password = document.getElementById("auth-password").value
  const url = back + "/auth"
  const body = new URLSearchParams()
  body.append("data", `{"password": "${password}"}`)
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  })
  .then((response) => {
    if (response.ok) {
      return response.json()
    }
    else{
      document.querySelector("#error-auth").textContent = "Mot de passe incorrect"
      return response.json().then((err) => {
        throw new Error(err)
      })
    }
  }).then((json) => {
    localStorage.setItem("auth", json.data)
    window.location.reload()
  })  
  .catch((error) => {
    document.querySelector("#error-auth").textContent = "Problème de serveur, veuillez réessayer plus tard"
    console.log(error)
  })
}

function showPanel(){
  const espacemenu = document.querySelector(".espace-menu")
  espacemenu.classList.add("hidden")
  const adminmenu = document.querySelector(".admin-menu")
  adminmenu.classList.remove("hidden")
}

function backLogout(){
  localStorage.removeItem("auth")
  window.location.reload()
}

function miseEnPlace() {
  if (localStorage.getItem("auth")) {
    showPanel()
    const logout = document.querySelector(".admin-menu .back-button")
    logout.addEventListener("click", backLogout, false)
  }
  else{
    const espaceAdmin = document.getElementById("espace-admin");
    espaceAdmin.addEventListener(
      "click",
      function () {
        showAuth();
      },
      false
    );
  }
}

window.addEventListener("load", miseEnPlace);
