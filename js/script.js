import * as particles_module from "../node_modules/particlesjs/src/particles.js";
import VanillaTilt from "../node_modules/vanilla-tilt/src/vanilla-tilt.js";

// helper functions
function setAttributes(element, attributes) {
  for (let key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// caching DOM Elements
const mainPageContent = document.querySelector("#page-main-content");
const mainPageNavigation = document.querySelector("#navigation");
let isLoggedin = false;

// ParticlesJS
window.onload = function () {
  Particles.init({
    selector: ".background",
    maxParticles: 150,
    minDistance: 140,
    connectParticles: true,
    color: "#ffffff",
    responsive: [
      {
        breakpoint: 1200,
        options: {
          minDistance: 130,
          maxParticles: 120,
        },
      },
      {
        breakpoint: 1000,
        options: {
          minDistance: 120,
          maxParticles: 120,
        },
      },
      {
        breakpoint: 768,
        options: {
          minDistance: 100,
          maxParticles: 120,
        },
      },
      {
        breakpoint: 400,
        options: {
          minDistance: 75,
          maxParticles: 120,
        },
      },
    ],
  });
  if (isLoggedin) {
    pageApp();
  } else {
    pageSignIn();
  }
};

// -- pages -----------------------------

// app page
function pageApp(user) {
  // clearing the DOM
  mainPageContent.textContent = "";
  mainPageNavigation.textContent = "";

  // -- creating and displaying the DOM
  // navigation button
  const navigationButton = document.createElement("a");
  navigationButton.setAttribute("href", "#");
  navigationButton.textContent = "Sign Out";
  mainPageNavigation.appendChild(navigationButton);
  navigationButton.addEventListener("click", (e) => {
    e.preventDefault();
    pageSignIn();
  });
  // user Info
  const userInfo = document.createElement("section");
  userInfo.classList.add("user-info");
  const userInfoText = document.createElement("h1");
  userInfoText.textContent = `${user.name} your currently entry count is #${user.entries}`;
  userInfo.appendChild(userInfoText);
  // main app
  const mainApp = document.createElement("section");
  mainApp.classList.add("app");
  const mainAppText = document.createElement("h1");
  mainAppText.textContent = "This magic Brain will detect faces in your pictures. Give it a try.";
  const mainAppFormContainer = document.createElement("div");
  mainAppFormContainer.classList.add("app-form-container");
  const mainAppForm = document.createElement("form");
  mainAppForm.setAttribute("id", "app-form");
  const mainAppFormInput = document.createElement("input");
  setAttributes(mainAppFormInput, { type: "text", name: "image-source", id: "image-source" });
  const mainAppFormButton = document.createElement("button");
  mainAppFormButton.setAttribute("type", "submit");
  mainAppFormButton.textContent = "Detect";
  mainAppFormContainer.appendChild(mainAppForm);
  mainAppForm.append(mainAppFormInput, mainAppFormButton);
  const mainAppImgContainer = document.createElement("div");
  setAttributes(mainAppImgContainer, { class: "selected-image-container", id: "selected-image-container" });
  mainApp.append(mainAppText, mainAppFormContainer, mainAppImgContainer);
  // append to page
  mainPageContent.append(userInfo, mainApp);

  // -- functionality

  // global variables
  let imageEl;

  // caching DOM elements
  const imageSourceEl = document.querySelector("#image-source");
  const formEl = document.querySelector("#app-form");
  const imageContainerEl = document.querySelector("#selected-image-container");

  // -- app functionality -----------------

  // image source change
  imageSourceEl.addEventListener("change", (e) => {
    // reset the container
    imageContainerEl.textContent = "";
    // create image element
    imageEl = document.createElement("img");
    imageEl.src = e.currentTarget.value;
    imageEl.title = "Selected Image";
    // append
    imageContainerEl.appendChild(imageEl);
  });

  // form submission (request to detect)
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();

    fetch("http://localhost:3000/image", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, imageSrc: imageEl.src }),
    })
      .then((response) => response.json())
      .then((response) => {
        return response;
      })
      .then((data) => {
        // update the entry count for the user
        userInfoText.textContent = `${data.name} your current entry count is #${data.entries}`;
        // draw the boxes
        data.faceBoxesArray.forEach((faceBox) => {
          // create element and add css build class
          const faceBoxEl = document.createElement("div");
          faceBoxEl.classList.add("face-box");
          // define points for absolute positioning
          faceBoxEl.style.top = `${faceBox.top_row * 100}%`;
          faceBoxEl.style.right = `${(1 - faceBox.right_col) * 100}%`;
          faceBoxEl.style.bottom = `${(1 - faceBox.bottom_row) * 100}%`;
          faceBoxEl.style.left = `${faceBox.left_col * 100}%`;
          // append
          imageContainerEl.appendChild(faceBoxEl);
        });
      })
      .catch((err) => {
        console.log("Error when sending the image for processing: ", err);
      });
  });
}

// register page
function pageRegister() {
  // -- helper functions
  function appendToRegisterForm(form, labels, inputs, button) {
    labels.forEach((label, index) => {
      form.append(label, inputs[index]);
    });
    form.appendChild(button);
  }

  // clearing the DOM
  mainPageContent.textContent = "";
  mainPageNavigation.textContent = "";

  // -- creating and displaying the DOM
  // navigation button
  const navigationButton = document.createElement("a");
  navigationButton.setAttribute("href", "#");
  navigationButton.textContent = "Sign In";
  mainPageNavigation.appendChild(navigationButton);
  navigationButton.addEventListener("click", (e) => {
    e.preventDefault();
    pageSignIn();
  });
  // register form container
  const container = document.createElement("section");
  container.classList.add("register-form-container");
  const text = document.createElement("h1");
  text.textContent = "Register";
  // form
  const form = document.createElement("form");
  form.setAttribute("id", "register-form");
  // labels
  let labels = [];
  labels[0] = document.createElement("label");
  labels[0].setAttribute("for", "register-name");
  labels[0].textContent = "Name";
  labels[1] = document.createElement("label");
  labels[1].setAttribute("for", "register-email");
  labels[1].textContent = "Email";
  labels[2] = document.createElement("label");
  labels[2].setAttribute("for", "register-password");
  labels[2].textContent = "Password";
  // inputs
  let inputs = [];
  inputs[0] = document.createElement("input");
  setAttributes(inputs[0], { type: "text", name: "register-name", id: "register-name" });
  inputs[1] = document.createElement("input");
  setAttributes(inputs[1], { type: "email", name: "register-email", id: "register-email" });
  inputs[2] = document.createElement("input");
  setAttributes(inputs[2], { type: "password", name: "register-password", id: "register-password" });
  const button = document.createElement("button");
  button.setAttribute("type", "submit");
  button.textContent = "Register";
  // apend to form
  appendToRegisterForm(form, labels, inputs, button);
  // Append to container
  container.append(text, form);
  // Append to page
  mainPageContent.appendChild(container);

  // --- register functionality
  // signIn Function
  async function register() {
    let response = await fetch("http://localhost:3000/register", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: inputs[0].value,
        email: inputs[1].value,
        password: inputs[2].value,
      }),
    });
    let data = await response.json();

    if (data.id) {
      pageApp(data);
    }
  }
  // form event listener
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    register();
  });
}

// sign in page
function pageSignIn() {
  // -- helper functions
  function appendToSignInForm(form, labels, inputs, button) {
    labels.forEach((label, index) => {
      form.append(label, inputs[index]);
    });
    form.appendChild(button);
  }

  // clearing the DOM
  mainPageContent.textContent = "";
  mainPageNavigation.textContent = "";

  // -- creating and displaying the DOM
  // navigation button
  const navigationButton = document.createElement("a");
  navigationButton.setAttribute("href", "#");
  navigationButton.textContent = "Register";
  mainPageNavigation.appendChild(navigationButton);
  navigationButton.addEventListener("click", (e) => {
    e.preventDefault();
    pageRegister();
  });
  // register form container
  const container = document.createElement("section");
  container.classList.add("sign-in-form-container");
  const text = document.createElement("h1");
  text.textContent = "Sign In";
  // form
  const form = document.createElement("form");
  form.setAttribute("id", "sign-in-form");
  // labels
  let labels = [];
  labels[0] = document.createElement("label");
  labels[0].setAttribute("for", "log-in-email");
  labels[0].textContent = "Email";
  labels[1] = document.createElement("label");
  labels[1].setAttribute("for", "log-in-password");
  labels[1].textContent = "Password";
  // inputs
  let inputs = [];
  inputs[0] = document.createElement("input");
  setAttributes(inputs[0], { type: "email", name: "log-in-email", id: "log-in-email" });
  inputs[1] = document.createElement("input");
  setAttributes(inputs[1], { type: "password", name: "log-in-password", id: "log-in-password" });

  const button = document.createElement("button");
  button.setAttribute("type", "submit");
  button.textContent = "Sign In";
  // apend to form
  appendToSignInForm(form, labels, inputs, button);
  // Append to container
  container.append(text, form);
  // Append to page
  mainPageContent.appendChild(container);

  // --- signIn functionality
  // signIn Function
  async function signIn() {
    let response = await fetch("http://localhost:3000/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: inputs[0].value,
        password: inputs[1].value,
      }),
    });
    let data = await response.json();

    if (data.id) {
      pageApp(data);
    }
  }
  // form event listener
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    signIn();
  });
}
