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
const turnamentLocation = form[5];
const acceptsConditions = form[11];
const wantToBeNotified = form[7];

// Hold form inputs validity errors in object
let errors = {};

// REGEX rules
const regex = {
  noSpecialChars: /^[a-zA-Z'\-àäâéêëç]{2,}$/i,
  passwordCheck : /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&()+,-./:;=?@\\[\\]^_`{|}~])[A-Za-z0-9!#$%&()+,-./:;=?@\\[\\]^_`{|}~]{8,}$/,
  mailCheck : /.+@.+\.[a-zA-Z]{2,}$/i,
  isNumber: /^[0-9]+/,
};

// Check and valid values of each inputs on change
form.addEventListener("change", (e) => {
  switch (e.target.name) {
    case "first":
    case "last":
      if (!regex.noSpecialChars.test(e.target.value)) {
        e.target.parentNode.dataset.error = "Saisie incorrecte. Uniquement des caractères (2 minimum) sans espace et avec ou sans accents.";
        e.target.parentNode.dataset.errorVisible = "true";
        errors[e.target.name] = e.target.value;
      } else {
        e.target.parentNode.dataset.error = "";
        e.target.parentNode.dataset.errorVisible = "false";
        delete errors[e.target.name];
      }
      disableSubmitBtn()
      break;
  
    case "email":
      if (!regex.mailCheck.test(email.value)) {
        e.target.parentNode.dataset.error = "Adresse email invalide.";
        e.target.parentNode.dataset.errorVisible = "true";
        errors[e.target.name] = e.target.value;
      } else {
        e.target.parentNode.dataset.error = "";
        e.target.parentNode.dataset.errorVisible = "false";
        delete errors[e.target.name];
      }
      disableSubmitBtn()
      break;
  
    case "birthdate":
      if (
        e.target.valueAsDate === null ||
        new Date(e.target.value).getTime() < new Date("1900-01-01").getTime()        
        ) {
          e.target.parentNode.dataset.error = "Entrez une valeur valide.";
          e.target.parentNode.dataset.errorVisible = "true";
          errors[e.target.name] = e.target.value;
      } else {
        if (compareAge(e.target.valueAsNumber)) {
          e.target.parentNode.dataset.error = "Entrez une valeur valide. *Vous devez avoir au minimum 15ans pour pouvoir participer.";
          e.target.parentNode.dataset.errorVisible = "true";
          errors[e.target.name] = e.target.value;
        } else {
          e.target.parentNode.dataset.error = "";
          e.target.parentNode.dataset.errorVisible = "false";
          delete errors[e.target.name];
        }
        disableSubmitBtn()
        break;
      }
      disableSubmitBtn()
      break;
  
    case "quantity":  
      if (e.target.value === "" || e.target.validity.badInput || !regex.isNumber.test(parseInt(e.target.value)) || e.target.valueAsNumber < 1 || e.target.valueAsNumber > 99) {
        e.target.parentNode.dataset.error = "Saisie invalide. Entrez un nombre entre 1 et 99.";
        e.target.parentNode.dataset.errorVisible = "true";
        errors[e.target.name] = e.target.value;
      } else {
        e.target.parentNode.dataset.error = "";
        e.target.parentNode.dataset.errorVisible = "false";
        delete errors[e.target.name];
      }
      disableSubmitBtn()
      break;
  
    case "location":
      if (e.target.value === "") {
        e.target.parentNode.dataset.error = "Veuillez selectionner une option.";
        e.target.parentNode.dataset.errorVisible = "true";
        errors[e.target.name] = e.target.value;
      } else {
        e.target.parentNode.dataset.error = "";
        e.target.parentNode.dataset.errorVisible = "false";
        delete errors[e.target.name];
      }
      disableSubmitBtn()
      break;
  
    case "consent":
      if (!e.target.checked) {
        e.target.parentNode.dataset.error = "Vous devez accepter les conditions d'utilisation pour continuer.";
        e.target.parentNode.dataset.errorVisible = "true";
        e.target.labels[0].childNodes[1].style.border = "2px solid red";
        errors[e.target.name] = "Accepter les conditions d'utilisation.";
      } else {
        e.target.parentNode.dataset.error = "";
        e.target.parentNode.dataset.errorVisible = "false";
        e.target.labels[0].childNodes[1].removeAttribute("style");
        delete errors[e.target.name];
      }
      disableSubmitBtn()
      break;
  
    default:
      break;
  };
});

// Compare if age is up to 15
function compareAge(age) {
  const actualYear = new Date(Date.now()).getFullYear();
  const yearToCompare = new Date(age).getFullYear();
  const checkValidAgeToParticipate = actualYear - 15;
  const actualDate = new Date(Date.now());
  const actualDateMin15 = age + 473040000000;

  if (yearToCompare > checkValidAgeToParticipate || actualDateMin15 > actualDate) {
    return true
  } else {
    return false
  }
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
  if (firstName.value !== "" &&
      lastName.value !== "" &&
      email.value !== "" &&
      birthdate.value !== "" &&
      quantityOfTurnamentsParticipated.value !== "" &&
      turnamentLocation !== "" &&
      acceptsConditions.value === "on"
    ) {
      firstName.value = "";
      lastName.value = "";
      email.value = "";
      birthdate.value = "";
      quantityOfTurnamentsParticipated.value = 1;
      //show confirmation after sending form
      formConfirmMessage.style.display = "flex";
      closeModalBtn.classList.add("btn-close-confirm");
    } else {
      //add visual error before retry
      errors.submitError = "Il y a eu une erreur. Vérifiez vos informations puis réessayez."
    }
})
