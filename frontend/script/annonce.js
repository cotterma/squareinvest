import { back, admins } from "./config.js";
import { showPreviousSlide, showNextSlide, resetSlide} from "./gallery.js";
import { sendDemand } from "./demande.js";

let selectedImages = [];
let selectedEditImages = [];


function sendAnnonce() {
  var title = document.getElementById("titre-annonce").value;
  var description = document.getElementById("description-annonce").value;
  var price = document.getElementById("prix-annonce").value;
  const error = document.getElementById("error-annonce");
  error.style.color = "green"
  error.innerText = "Envoi en cours..."
  var files = selectedImages; // Récupérer le fichier sélectionné
  if (files && files.length > 0) {
    // Créer une instance de FormData et y ajouter le fichier
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      formData.append("image", file);
    }

    formData.append("titre", title);
    formData.append("description", description);
    formData.append("prix", price);
    const url = back + "/auth_api/annonce";
    // Effectuer une requête AJAX ou envoyer les données via fetch()
    // en utilisant l'URL et la méthode appropriées
    // par exemple :
    fetch(url, {
      method: "POST",
      headers: {
        "x-access-token": localStorage.getItem("auth"),
      },
      body: formData,
    })
      .then((response) => {
        // Traiter la réponse du serveur
        if (response.ok) {
          error.innerText = "Annonce envoyée avec succès";
          refresh();
        } else {
          return response.json().then((error) => {
            throw error;
          });
        }
      })
      .catch((err) => {
        // Gérer les erreurs
        console.log(err);
        error.style.color = "red"
        error.innerText = "Une erreur est survenue lors de l'envoi de l'annonce, veuillez réessayer";
      });

    // À partir d'ici, vous pouvez effectuer la requête AJAX ou envoyer les données via fetch()
    // en utilisant l'URL et la méthode appropriées, en utilisant formData comme corps de la requête.
  } else {
    console.log("Aucune image sélectionnée");
    error.style.color = "red"
    error.innerText = "Aucune image sélectionnée"
  }
}

async function getAnnonces() {
  const main= document.querySelector(".appartement-main");
  const loading = document.createElement("div");
  loading.setAttribute("id", "loading-spinner");
  main.append(loading)
  const url = back + "/annonces";
  const annonces = await fetch(url, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then((response) => {
      // Traiter la réponse du serveur
      if (response.ok) {
        main.removeChild(loading);
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
      // Gérer les erreurs
      main.removeChild(loading);
      const error_message = document.createElement("div");
      error_message.setAttribute("id", "error-appartement");
      error_message.innerText = "Une erreur est survenue lors du chargement des annonces, veuillez rafraichir la page.\nSi le problème persiste, il s'agit d'un problème d'hébergeur, veuillez réessayer plus tard.";
      error_message.style.display = "flex";
      error_message.style.justifyContent = "center";
      error_message.style.textAlign = "center";
      main.appendChild(error_message);
      console.log(error);
    });
  return annonces;
}

async function getAnnonce(element) {
  const loading = document.createElement("div");
  loading.setAttribute("id", "loading-spinner");
  element.append(loading);
  const id = element.getAttribute("id");
  const url = back + "/annonce/" + id;
  const annonce = await fetch(url, {
    method: "GET",
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
      element.removeChild(loading);
      return json;
    })
    .catch((error) => {
      // Gérer les erreurs
      element.removeChild(loading);
      alert("Une erreur est survenue lors du chargement de l'annonce")
      console.log(error);
    });
  return annonce;
}

async function setAnnonces() {
  const json = await getAnnonces();
  const list = document.querySelector("#appartement-list");
  list.innerHTML = "";
  for (let element of json.data) {
    const new_annonce = document.createElement("div");
    new_annonce.classList.add("appartement");
    new_annonce.setAttribute("id", element.id);

    const announce_image = document.createElement("div");
    announce_image.classList.add("appartement-image");
    const image = document.createElement("img");
    image.setAttribute("src", `${back + "/" + element.path}`);
    image.classList.add("crop-image");
    image.setAttribute("load", "lazy");
    announce_image.appendChild(image);

    const announce_content = document.createElement("div");
    announce_content.classList.add("appartement-content");

    const announce_title = document.createElement("div");
    announce_title.classList.add("appartement-title");
    announce_title.innerText = element.titre;
    announce_content.appendChild(announce_title);

    const hr = document.createElement("hr");
    hr.classList.add("appartement-hr");
    announce_content.appendChild(hr);

    const announce_description = document.createElement("div");
    announce_description.classList.add("appartement-description");
    announce_description.innerText = element.description;
    announce_content.appendChild(announce_description);

    const announce_infos = document.createElement("div");
    announce_infos.classList.add("appartement-infos");
    const announce_price = document.createElement("div");
    announce_price.classList.add("appartement-price");
    announce_price.innerText = element.prix + "€/mois";
    announce_infos.appendChild(announce_price);

    new_annonce.appendChild(announce_image);
    new_annonce.appendChild(announce_content);
    new_annonce.appendChild(announce_infos);

    list.appendChild(new_annonce);
  }
  // if (admins.includes(localStorage.getItem("email"))) {
  if (localStorage.getItem("auth")) {
    setRestricted(json);
  }
}

function setRestricted(json) {
  const list = document.querySelector("#liste-annonces");
  list.innerHTML = "";
  for (let element of json.data) {
    const new_annonce = document.createElement("div");
    new_annonce.classList.add("annonce");

    const annonce_title = document.createElement("div");
    annonce_title.classList.add("annonce-title");
    annonce_title.innerText = element.titre;
    new_annonce.appendChild(annonce_title);

    const edit_button = document.createElement("button");
    edit_button.classList.add("annonce-edit");
    edit_button.innerText = "Modifier";
    edit_button.setAttribute("id", element.id);
    new_annonce.appendChild(edit_button);

    const delete_button = document.createElement("button");
    delete_button.classList.add("annonce-delete");
    delete_button.innerText = "Supprimer";
    delete_button.setAttribute("id", element.id);
    new_annonce.appendChild(delete_button);

    const hr = document.createElement("hr");
    hr.classList.add("annonce-hr");
    new_annonce.appendChild(hr);

    list.appendChild(new_annonce);
  }
}

function deleteAnnonce(id) {
  const url = back + "/auth_api/annonce/" + id;
  fetch(url, {
    method: "DELETE",
    headers: {
      "x-access-token": localStorage.getItem("auth"),
    },
  })
    .then((response) => {
      // Traiter la réponse du serveur
      if (response.ok) {
        console.log("Annonce supprimée avec succès");
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

function back_appart() {
  const selected_annonce = document.querySelector(".selected-annonce");
  selected_annonce.classList.add("hidden");
  const main = document.querySelector(".appartement-main");
  main.classList.remove("hidden");
}

async function displayAnnonce(element) {
  const annonce = await getAnnonce(element);
  resetSlide();
  const selected_annonce = document.querySelector(".selected-annonce");
  let main = document.querySelector("main");
  let contents = main.childNodes;
  for (var i = 0; i < contents.length; i++) {
    var node = contents[i];

    if (
      node.nodeType === Node.ELEMENT_NODE &&
      !node.classList.contains("hidden")
    ) {
      node.classList.add("hidden");
    }
  }
  selected_annonce.classList.remove("hidden");
  const form = document.querySelector("#contact").cloneNode(true);
  form.querySelector("#error-contact").innerText = "";
  selected_annonce.innerHTML = "";
  const back_button = document.createElement("div");
  back_button.classList.add("back-button");
  selected_annonce.appendChild(back_button);
  back_button.addEventListener("click", back_appart);

  const announce_title = document.createElement("div");
  announce_title.classList.add("selected-title");
  announce_title.innerText = annonce.data.titre;
  selected_annonce.appendChild(announce_title);

  const announce_content = document.createElement("div");
  announce_content.classList.add("selected-content");
  selected_annonce.appendChild(announce_content);

  const announce_gallery = document.createElement("div");
  announce_gallery.setAttribute("id", "gallery");
  announce_content.appendChild(announce_gallery);

  for (let element of annonce.data.paths) {
    const a = document.createElement("a");
    a.setAttribute("href", `${back + "/" + element}`);
    a.setAttribute("target", "_blank");
    const image = document.createElement("img");
    image.setAttribute("src", `${back + "/" + element}`);
    image.classList.add("slide");
    image.classList.add("hidden");
    a.appendChild(image);
    announce_gallery.appendChild(a);
  }
  announce_gallery.firstChild.firstChild.classList.remove("hidden");

  const prev_arrow = document.createElement("div");
  prev_arrow.setAttribute("id", "prev-arrow");
  prev_arrow.innerHTML = "&#10094;";
  announce_gallery.appendChild(prev_arrow);

  const next_arrow = document.createElement("div");
  next_arrow.setAttribute("id", "next-arrow");
  next_arrow.innerHTML = "&#10095;";
  announce_gallery.appendChild(next_arrow);

  const announce_description = document.createElement("div");
  announce_description.classList.add("selected-description");
  announce_description.innerText = annonce.data.description;
  announce_content.appendChild(announce_description);

  selected_annonce.appendChild(form);
  document.querySelector("#sendcontact").addEventListener(
    "click",
    () => {
      sendDemand();
    },
    false
  );
  setGallery();
}

function setGallery() {
  const prevArrow = document.querySelector("#prev-arrow");
  const nextArrow = document.querySelector("#next-arrow");

  prevArrow.addEventListener(
    "click",
    () => {
      showPreviousSlide();
    },
    false
  );
  nextArrow.addEventListener(
    "click",
    () => {
      showNextSlide();
    },
    false
  );
}

async function refresh() {
  window.location.reload();
}

async function showEdit(element) {
  const id = element.getAttribute("id");
  const parent = element.parentNode;
  if (parent.classList.contains("editing")) {
    parent.classList.remove("editing");
    parent.removeChild(parent.lastChild);
  } else {
    const previousEdit = document.querySelector(".editing");
    if (previousEdit) {
      previousEdit.classList.remove("editing");
      previousEdit.removeChild(previousEdit.lastChild);
    }
    const url = back + "/annonce/" + id;
    const annonce = await fetch(url, {
      method: "GET",
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
        return json;
      })
      .catch((error) => {
        // Gérer les erreurs
        console.log(error);
      });
    parent.classList.add("editing");
    const form = document.createElement("div");
    form.classList.add("edit-form");

    const title_input = document.createElement("input");
    title_input.setAttribute("type", "text");
    title_input.setAttribute("id", "title-edit");
    title_input.setAttribute("placeholder", "Titre");
    title_input.value = annonce.data.titre;
    form.appendChild(title_input);

    const description_input = document.createElement("textarea");
    description_input.setAttribute("id", "description-edit");
    description_input.setAttribute("placeholder", "Description");
    description_input.setAttribute("rows", "8");
    description_input.innerText = annonce.data.description;
    form.appendChild(description_input);

    const info_input = document.createElement("input");
    info_input.setAttribute("type", "text");
    info_input.setAttribute("id", "info-edit");
    info_input.setAttribute("placeholder", "Prix");
    info_input.value = annonce.data.prix;
    form.appendChild(info_input);

    const input_image = document.createElement("input");
    input_image.setAttribute("type", "file");
    input_image.setAttribute("id", "edit-img");
    input_image.setAttribute("accept", "image/*");
    form.appendChild(input_image);

    const show_img = document.createElement("div");
    show_img.setAttribute("id", "show-edit");
    form.appendChild(show_img);

    input_image.addEventListener('change', handleEditImageSelection);
    selectedEditImages = [];
    for (let image of annonce.data.paths) {
      const url = back + "/" + image;
      const img = createEditImagePreview(url);
      show_img.appendChild(img);
      await createNewFile(url).then((file) => {selectedEditImages.push(file)});
    }

    const span = document.createElement("span");
    span.setAttribute("id", "error-edit");
    form.appendChild(span);

    const submit_button = document.createElement("button");
    submit_button.setAttribute("id", "submit-edit");
    submit_button.setAttribute("id_annonce", id);
    submit_button.innerHTML = "Modifier";
    form.appendChild(submit_button);

    submit_button.addEventListener(
      "click",
      () => {
        editAnnonce();
      },
      false
    );

    parent.appendChild(form);
  }
}

function editAnnonce() {
  const id = document.querySelector("#submit-edit").getAttribute("id_annonce");
  const url = back + "/auth_api/annonce/" + id;
  const formData = new FormData();
  formData.append("titre", document.querySelector("#title-edit").value);
  formData.append(
    "description",
    document.querySelector("#description-edit").value
  );
  formData.append("prix", document.querySelector("#info-edit").value);
  const files = selectedEditImages; // Récupérer le fichier sélectionné
  const error = document.getElementById("error-edit");
  error.style.color = "green"
  error.innerText = "Modification en cours.."
  if (files && files.length > 0) {
    // Créer une instance de FormData et y ajouter le fichier
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      formData.append("image", file);
    }
  }
  else{
    error.style.color = "red"
    error.innerText = "Aucune image sélectionnée"
    return
  }
  fetch(url, {
    method: "PUT",
    headers: {
      "x-access-token": localStorage.getItem("auth"),
    },
    body: formData,
  })
    .then((response) => {
      // Traiter la réponse du serveur
      if (response.ok) {
        console.log("Annonce modifiée avec succès");
        error.innerText = "Annonce modifiée avec succès";
        refresh();
      } else {
        return response.json().then((error) => {
          throw error;
        });
      }
    })
    .catch((err) => {
      // Gérer les erreurs
      error.style.color = "red"
      error.innerText = "Une erreur est survenue lors de la modification de l'annonce, veuillez réessayer";
      console.log(err);
    });
}

function refreshAdmin() {
// if (admins.includes(localStorage.getItem("email"))) {
  if (localStorage.getItem("auth")){
    document.querySelector("#send-annonce").addEventListener(
      "click",
      function () {
        sendAnnonce();
      },
      false
    );
    for (let element of document.querySelectorAll(".annonce-delete")) {
      element.addEventListener(
        "click",
        function () {
          deleteAnnonce(element.getAttribute("id"));
        },
        false
      );
    }
    for (let element of document.querySelectorAll(".annonce-edit")) {
      element.addEventListener(
        "click",
        function () {
          showEdit(element);
        },
        false
      );
    }
    
    // Event listener for when an image is selected
    imageInput.addEventListener('change', handleImageSelection);
  }
}

const imageInput = document.getElementById('image');
const imagePreviewContainer = document.getElementById('selected-photos');

// Function to handle image selection
function handleImageSelection(event) {
  const files = event.target.files;

  // Loop through selected files and create image previews
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

    reader.onload = function(event) {
      const imageUrl = event.target.result;
      const imagePreview = createImagePreview(imageUrl);
      selectedImages.push(file);
      imagePreviewContainer.appendChild(imagePreview);
    };

    reader.readAsDataURL(file);
  }

  // Clear the input field to allow selecting more images
  imageInput.value = '';
}

async function fetchImageAsBlob(url) {
  const response = await fetch(url);
  const data = await response.blob();
  return data;
}

// Function to create a new File object from a Blob
function createFileFromBlob(blob, fileName, fileType) {
  return new File([blob], fileName, { type: fileType, lastModified: Date.now() });
}

async function getImageInfoFromURL(imageURL) {
  try {
    const response = await fetch(imageURL, {
      method: "HEAD",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch image information");
    }

    const imageName = getFileNameFromURL(imageURL);
    const imageType = response.headers.get("content-type");

    return { name: imageName, type: imageType };
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

function getFileNameFromURL(url) {
  return url.split("/").pop();
}

// Usage example
async function createNewFile(imagePath) {
  try {
    const imageBlob = await fetchImageAsBlob(imagePath);
    const new_file = getImageInfoFromURL(imagePath)
    .then((imageInfo) => {
        const newFileName = imageInfo.name; // Specify the desired file name
        const newFileType = imageInfo.type; // Specify the desired file type (MIME type)
        const newFile = createFileFromBlob(imageBlob, newFileName, newFileType);
        return newFile;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
    return new_file;
  } catch (error) {
    console.error("Error:", error);
  }
}

function handleEditImageSelection(event) {
  
  const files = event.target.files;
  const imageEditPreviewContainer = document.getElementById('show-edit');

  // Loop through selected files and create image previews
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

    reader.onload = function(event) {
      const imageUrl = event.target.result;
      const imagePreview = createEditImagePreview(imageUrl);
      selectedEditImages.push(file);
      imageEditPreviewContainer.appendChild(imagePreview);
    };

    reader.readAsDataURL(file);
  }

  // Clear the input field to allow selecting more images
  const imageEditInput = document.getElementById('edit-img');
  imageEditInput.value = '';
}

// Function to create an image preview with a delete button
function createImagePreview(imageUrl) {
  const imageElement = document.createElement('img');
  imageElement.src = imageUrl;
  imageElement.style.cursor = 'pointer';
  imageElement.addEventListener('mouseover', function() {
    imageElement.style.opacity = '0.5';
  });
  imageElement.addEventListener('mouseout', function() {
    imageElement.style.opacity = '1';
  });

  imageElement.addEventListener('click', function() {
    const index = Array.from(imagePreviewContainer.children).indexOf(imageElement);
    selectedImages.splice(index, 1);
    imagePreviewContainer.removeChild(imageElement);
  });

  return imageElement;
}

// Function to create an image preview with a delete button
function createEditImagePreview(imageUrl) {
  const imageElement = document.createElement('img');
  imageElement.src = imageUrl;
  imageElement.style.cursor = 'pointer';
  imageElement.addEventListener('mouseover', function() {
    imageElement.style.opacity = '0.5';
  });
  imageElement.addEventListener('mouseout', function() {
    imageElement.style.opacity = '1';
  });

  imageElement.addEventListener('click', function() {
    const index = Array.from(document.getElementById('show-edit').children).indexOf(imageElement);
    selectedEditImages.splice(index, 1);
    document.getElementById('show-edit').removeChild(imageElement);
  });

  return imageElement;
}

/* On document loading */
async function miseEnPlace() {
  await setAnnonces();

  for (let element of document.querySelectorAll(".appartement")) {
    element.addEventListener(
      "click",
      function () {
        displayAnnonce(element);
      },
      false
    );
  }
  refreshAdmin();
}

window.addEventListener("load", miseEnPlace, false);
