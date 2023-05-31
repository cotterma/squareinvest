import { resetSlide } from "./gallery.js";

function switchMenu(id) {
  let main = document.querySelector("main");
  let contents = main.childNodes;
  for (var i = 0; i < contents.length; i++) {
    var node = contents[i];

    if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains(id)) {
      node.classList.add('hidden');
      node.classList.remove('fade-in');
    }

    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains(id)) {
      node.classList.remove('hidden');
      node.classList.add('fade-in');
    }
  }
}

/* On document loading */
function miseEnPlace() {
  // Listen to the clicks on menu items
  for (let element of document.querySelectorAll("#menu ul:not(.connected) li")) {
    element.addEventListener(
      "click",
      function () {
        switchMenu(element.getAttribute("id"));
        resetSlide();
      },
      false
    );
  }
  document.querySelector("#account-main").addEventListener(
    "click",
    function () {
      switchMenu("account-main");
      resetSlide();
    }
  );
}

window.addEventListener("load", miseEnPlace, false);
