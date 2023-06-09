import {back} from "./config.js"

function showAuth() {
  const espaceAdmin = document.getElementById("espace-admin");
  const menu= document.querySelector(".espace-menu")
  if (document.querySelector(".espace-menu .auth-field")) {
      menu.removeChild(document.querySelector(".espace-menu .auth-field"))
      menu.removeChild(document.querySelector(".espace-menu .auth-valid"))
  }
  else{
    const passwordField = document.createElement("input");
    passwordField.classList.add("auth-field");
    passwordField.setAttribute("id", "auth-password");
    passwordField.setAttribute("placeholder", "Mot de passe");
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
      "Content-Type": "application/json",
    },
  })
  .then((response) => {
    if (response.ok) {
      return response.json()
    }
    else{
      throw new Error("Mot de passe incorrect")
    }
  }).then((data) => {
    localStorage.setItem("token", data.token)
    showPanel()
  })  
}

function showPanel(){
  const espacemenu = document.querySelector(".espace-menu")
  espacemenu.classList.add("hidden")
  const adminmenu = document.querySelector("#admin-menu")
  adminmenu.classList.remove("hidden")
}

function miseEnPlace() {
  const espaceAdmin = document.getElementById("espace-admin");
  espaceAdmin.addEventListener(
    "click",
    function () {
      showAuth();
    },
    false
  );
}

window.addEventListener("load", miseEnPlace);
