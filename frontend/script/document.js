import {back} from "./config.js";

function sendDoc() {
  var fileInput = document.getElementById("document");
  var file = fileInput.files[0]; // Récupérer le fichier sélectionné
  if (file) {
    // Créer une instance de FormData et y ajouter le fichier
    var formData = new FormData();
    formData.append("document", file);
    const url = back + "/auth_api/upload_doc";
    // Effectuer une requête AJAX ou envoyer les données via fetch()
    // en utilisant l'URL et la méthode appropriées
    // par exemple :
    fetch(url, {
      method: "POST",
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
      body: formData,
    })
      .then((response) => {
        // Traiter la réponse du serveur
        if (response.ok) {
          console.log("Document envoyé avec succès");
          refresh();
        } else {
          return response.json().then((error) => {
            throw error;
          });
        }
      })
      .catch((error) => {
        // Gérer les erreurs
        console.log(error);
      });

    // À partir d'ici, vous pouvez effectuer la requête AJAX ou envoyer les données via fetch()
    // en utilisant l'URL et la méthode appropriées, en utilisant formData comme corps de la requête.
  } else {
    console.log("Aucun fichier sélectionné");
  }
}

async function getDocs() {
  const url = back + "/auth_api/documents";
  const docs = await fetch(url, {
    method: "GET",
    headers: {
      "x-access-token": localStorage.getItem("token"),
    },
  })
    .then((response) => {
      // Traiter la réponse du serveur
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((error) => {
          throw error;
        });
      }
    }).then((json) => {
      return json
    })
    .catch((error) => {
      // Gérer les erreurs
      console.log(error);
    });
    return docs
}

async function getUserDocs(mail){
  const url = back + "/auth_api/documents/" + mail;
  const docs = await fetch(url, {
    method: "GET",
    headers: {
      "x-access-token": localStorage.getItem("token"),
    },
  })
    .then((response) => {
      // Traiter la réponse du serveur
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((error) => {
          throw error;
        });
      }
    })
    .then((json) => {
      return json
    }
    )
    .catch((error) => {
      // Gérer les erreurs
      console.log(error);
    }
    );
    return docs
}

async function setDocs(){
  const json = await getDocs();
  const list = document.querySelector("#document-list");
  list.innerHTML = "";
  for (let element of json.data) {
    const new_doc = document.createElement("div");
    new_doc.classList.add("document");

    const document_title = document.createElement("div");
    document_title.classList.add("document-title");
    document_title.innerHTML = "Document";

    const button = document.createElement("button");
    button.classList.add("open-document");
    button.setAttribute("path", `${back + "/auth_api/" + element.path}`);
    button.innerHTML = "Open document";

    const button_delete = document.createElement("button");
    button_delete.classList.add("delete-document");
    button_delete.setAttribute("path", `${back + "/auth_api/" + element.path}`);
    button_delete.innerHTML = "Delete document";

    new_doc.appendChild(document_title);
    new_doc.appendChild(button);
    new_doc.appendChild(button_delete);
    list.appendChild(new_doc);
  }
}

async function openDocument(path) {
  await fetch(path, {
    method: "GET",
    headers: {
      "x-access-token": localStorage.getItem("token"),
    },
  })  
    .then((response) => {
      // Traiter la réponse du serveur
      if (response.ok) {
        return response.blob();
      } else {
        return response.json().then((error) => {
          throw error;
        });
      }
    }
    ).then((blob) => {
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
    )
    .catch((error) => {
      // Gérer les erreurs
      console.log(error);
    }
    );
}

async function refresh() {
  await setDocs();
  for (let element of document.querySelectorAll(".open-document")) {
    element.addEventListener(
      "click",
      function () {
        openDocument(element.getAttribute("path"));
      },
      false
    );
  }
}

async function deleteDocument(path) {
  await fetch(path, {
    method: "DELETE",
    headers: {
      "x-access-token": localStorage.getItem("token"),
    },
  })
    .then((response) => {
      // Traiter la réponse du serveur
      if (response.ok) {
        console.log("Document supprimé avec succès");
        refresh();
      } else {
        return response.json().then((error) => {
          throw error;
        });
      }
    })
    .catch((error) => {
      // Gérer les erreurs
      console.log(error);
    });
}

/* On document loading */
async function miseEnPlace() {
  if (localStorage.getItem("token")) {
    await setDocs();
  }
  for (let element of document.querySelectorAll(".open-document")) {
    element.addEventListener(
      "click",
      function () {
        openDocument(element.getAttribute("path"));
      },
      false
    );
  }

  for (let element of document.querySelectorAll(".delete-document")) {
    element.addEventListener(
      "click",
      function () {
        deleteDocument(element.getAttribute("path"));
      },
      false
    );
  }

  document.querySelector("#send-doc").addEventListener(
    "click",
    function () {
      sendDoc();
    },
    false
  );
}

window.addEventListener("load", miseEnPlace, false);

export {getUserDocs, openDocument};