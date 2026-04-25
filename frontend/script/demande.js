import {back} from './config.js';

let backendReachabilityPromise;

function checkBackendReachability(forceRefresh = false) {
    if (!forceRefresh && backendReachabilityPromise) {
        return backendReachabilityPromise;
    }

    backendReachabilityPromise = fetch(back + "/annonces", {
        method: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    })
    .then((response) => response.ok)
    .catch(() => false);

    return backendReachabilityPromise;
}

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
            error.innerHTML = "Problème de communication avec le serveur";
            error.style.color = "red";
            throw new Error("Problème de communication avec le serveur");
        }
    })
    .catch(() => {
        error.innerHTML = "Problème de communication avec le serveur";
        error.style.color = "red";
        backendReachabilityPromise = Promise.resolve(false);
    });
}

export {sendDemand, checkBackendReachability};

