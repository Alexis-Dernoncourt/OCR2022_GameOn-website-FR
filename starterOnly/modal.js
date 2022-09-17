function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalContent = document.querySelector(".content");
const menuBtn = document.querySelector("#menu-btn");
const modalBtn = document.querySelectorAll(".modal-btn");
const closeModalBtn = document.querySelector(".close");
const form = document.querySelector("#reservation_form");
const formData = document.querySelectorAll(".formData");
const formSubmitBtn = document.querySelector(".btn-submit");
const formConfirmBtn = document.querySelector(".btn-close-confirm");
const formConfirmMessage = document.querySelector(".form-confirmation-body");

// FORM Elements
const firstName = form[0];
const lastName = form[1];
const email = form[2];
const birthdate = form[3];
const quantityOfTurnamentsParticipated = form[4];
const turnamentLocation = document.getElementsByName('location');
let turnamentLocationValue = {name: "", value: "", currentTarget: form[5].parentNode};
const acceptsConditions = form[11];
const wantToBeNotified = form[7];

// Hold form inputs validity errors in object
let errors = {};

// REGEX rules
const regex = {
  noSpecialChars: /^[a-zA-Z'\-àäâéêëçùûü]{2,}$/i,
  mailCheck : /.+@.+\.[a-zA-Z]{2,}$/i,
  isNumber: /^[0-9]+/,
};

// Check and valid values of each inputs on change
form.addEventListener("change", (e) => checkInputsData(e.target));

function checkInputsData(e) {
  if (e.name === 'first' || e.name === 'last') {
    if (regex.noSpecialChars.test(e.value)) {
      setHtmlDatasetError(e.parentNode, "", "false", e.name, "delete");
    } else {
      setHtmlDatasetError(e.parentNode, "Saisie incorrecte. Uniquement des caractères (2 minimum) sans espace et avec ou sans accents.", "true", e.name, e.value);
    }
  } else if (e.name === 'email') {
    if (regex.mailCheck.test(email.value)) {
      setHtmlDatasetError(e.parentNode, "", "false", e.name, "delete");
    } else {
      setHtmlDatasetError(e.parentNode, "Adresse email invalide.", "true", e.name, e.value);
    }
  } else if (e.name === 'birthdate') {
    if (
      e.valueAsDate === null ||
      new Date(e.value).getTime() < new Date("1900-01-01").getTime()        
      ) {
        setHtmlDatasetError(e.parentNode, "Entrez une valeur valide.", "true", e.name, e.value);
    } else {
      if (compareAge(e.valueAsNumber)) {
        setHtmlDatasetError(e.parentNode, "Entrez une valeur valide. *Vous devez avoir au minimum 15ans pour pouvoir participer.", "true", e.name, e.value);
      } else {
        setHtmlDatasetError(e.parentNode, "", "false", e.name, "delete");
      }
    }
  } else if (e.name === 'quantity') {
    if (e.value === "" || e.validity.badInput || regex.isNumber.test(parseInt(e.value)) === false || e.valueAsNumber < 0 || e.valueAsNumber > 99) {
      setHtmlDatasetError(e.parentNode, "Saisie invalide. Entrez un nombre entre 0 et 99.", "true", e.name, e.value);
    } else {
      setHtmlDatasetError(e.parentNode, "", "false", e.name, "delete");
    }
  } else if (e.name === 'location') {
    checkLocationValue();
    if (e.value === "") {
      if (e.currentTarget) {
        setHtmlDatasetError(e.currentTarget.parentNode, "Veuillez selectionner une option.", "true", e.name, e.value);
      } else {
        setHtmlDatasetError(e.parentNode, "Veuillez selectionner une option.", "true", e.name, e.value);
      }
    } else {
      if (e.currentTarget) {
        setHtmlDatasetError(e.currentTarget.parentNode, "", "false", e.name, "delete");
      } else {
        setHtmlDatasetError(e.parentNode, "", "false", e.name, "delete");
      }
    }
  } else if (e.name === 'consent') {
    if (e.checked) {
      e.labels[0].childNodes[1].removeAttribute("style");
      setHtmlDatasetError(e.parentNode, "", "false", e.name, "delete");
    } else {
      setHtmlDatasetError(e.parentNode, "Vous devez accepter les conditions d'utilisation pour continuer.", "true", e.name, "Vous devez accepter les conditions d'utilisation.");
      e.labels[0].childNodes[1].style.border = "2px solid red";
    }
  }
  disableSubmitBtn();
}

function setHtmlDatasetError(parentNode, message, visible, errorName, errorValue) {
  parentNode.dataset.error = message;
  parentNode.dataset.errorVisible = visible;
  (errorValue === "delete") ? delete errors[errorName] : errors[errorName] = errorValue;
}

function checkInputsDataOnSubmit() {
  checkInputsData(firstName);
  checkInputsData(lastName);
  checkInputsData(email);
  checkInputsData(birthdate);
  checkInputsData(quantityOfTurnamentsParticipated);
  checkInputsData(turnamentLocationValue);
  checkInputsData(acceptsConditions);
}

function checkLocationValue() {
  for (e of turnamentLocation) {
    if (e.checked) {
      turnamentLocationValue.name = e.name;
      turnamentLocationValue.value = e.value;
    }
  }

  if (turnamentLocationValue.value !== "") {
    setHtmlDatasetError(turnamentLocationValue.currentTarget, "", "false", "location", "delete");
  } else {
    setHtmlDatasetError(turnamentLocationValue.currentTarget, "Veuillez selectionner une option.", "true", "location", "");
  }
}

// Compare if age is up to 15
function compareAge(age) {
  const actualYear = new Date(Date.now()).getFullYear();
  const yearToCompare = new Date(age).getFullYear();
  const checkValidAgeToParticipate = actualYear - 15;
  const actualDate = new Date(Date.now());
  const actualDateMin15 = age + 473040000000;
  return (yearToCompare > checkValidAgeToParticipate || actualDateMin15 > actualDate)
}

// Disable submit btn on form error
function disableSubmitBtn() {
  if (Object.keys(errors).length > 0) {
    formSubmitBtn.setAttribute("disabled", "");
  } else {
    formSubmitBtn.removeAttribute("disabled");
  };
};

// click menu btn event
menuBtn.addEventListener("click", editNav);

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));
// close modal event
closeModalBtn.addEventListener("click", closeModal);
formConfirmBtn.addEventListener("click", closeModal);

// launch modal form
function launchModal() {
  if (modalContent.classList.contains("close-anim")) {
    modalContent.classList.remove("close-anim")
  }
  modalbg.style.display = "block";
}
// close modal form
function closeModal(e) {
  modalContent.classList.add("close-anim");
  setTimeout(() => {
    modalbg.style.display = "none";
    if (e.target.classList.contains('btn-close-confirm')) {
      formConfirmMessage.style.display = "none";
    }
  }, 500);
}

// check form values
form.addEventListener("submit", (e) => {
  e.preventDefault();
  checkLocationValue();
  if (
    firstName.value !== "" && firstName !== undefined &&
    lastName.value !== "" && lastName !== undefined &&
    email.value !== "" && email !== undefined &&
    birthdate.value !== "" && birthdate !== undefined &&
    quantityOfTurnamentsParticipated.value !== "" && quantityOfTurnamentsParticipated !== undefined &&
    turnamentLocationValue.value !== "" &&
    acceptsConditions.checked
  ) 
  {
    checkInputsDataOnSubmit()
    console.info({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      birthdate: birthdate.value,
      quantityOfTurnamentsParticipated: quantityOfTurnamentsParticipated.value,
      turnamentLocation: turnamentLocationValue.value,
      acceptsConditions: acceptsConditions.checked,
      wantToBeNotified: wantToBeNotified.checked
    });

    firstName.value = "";
    lastName.value = "";
    email.value = "";
    birthdate.value = "";
    quantityOfTurnamentsParticipated.value = "";
    turnamentLocationValue = {};
    acceptsConditions.checked = false;
    //show confirmation after sending form
    formConfirmMessage.style.display = "flex";
    closeModalBtn.classList.add("btn-close-confirm");
  } else {
    //add visual error before retry
    checkInputsDataOnSubmit()
    acceptsConditions.parentNode.dataset.error = "Il y a eu une erreur. Vérifiez vos informations puis réessayez.";
    acceptsConditions.parentNode.dataset.errorVisible = true;
    setTimeout(() => {
      acceptsConditions.parentNode.dataset.error = "";
      acceptsConditions.parentNode.dataset.errorVisible = false;
    }, 4000)
  }
})
