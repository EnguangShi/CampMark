// for bootstrap's form validation
// https://getbootstrap.com/docs/5.3/forms/validation/
(() => {
  "use strict";
  const forms = document.querySelectorAll(".validated-form");
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();
