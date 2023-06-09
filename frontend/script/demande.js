import {back} from './config.js';

function sendDemand(){
    const nom = document.getElementById("nom").value;
    const prenom = document.getElementById("prenom").value;
    const email = document.getElementById("mail").value;
    const telephone = document.getElementById("telephone").value;
    const message = document.getElementById("message").value;
    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("prenom", prenom);
    formData.append("email", email);
    formData.append("telephone", telephone);
    formData.append("message", message);
    const error = document.getElementById("error-contact");
    error.innerHTML = "Demande en cours d'envoi";
    error.style.color = "green";
    if(nom == "" || prenom == "" || email == "" || telephone == ""){
        error.innerHTML = "Veuillez remplir tous les champs";
        error.style.color = "red";
        return;
    }
    const url = back + "/demande";
    fetch(url, {
        method: "POST",
        body: formData
    })
    .then((response) =>{
        if(response.ok){
            console.log("Demande envoyée");
            error.innerHTML = "Demande envoyée";
        }
        else{
            throw new Error("Problème de communication avec le serveur");
        }
    });
}

export {sendDemand};

