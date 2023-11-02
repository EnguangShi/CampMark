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

// for validating number of images

// Fetch the configuration from the JSON file when the document loads
fetch("/config.json")
  .then((response) => response.json())
  .then((config) => {
    MAX_IMAGES = config.MAX_IMAGES;

    const imageInput = document.getElementById("formFileMultiple");

    imageInput.addEventListener("change", function () {
      const selectedFiles = imageInput.files;
      if (selectedFiles.length > MAX_IMAGES) {
        alert(`You can only upload ${MAX_IMAGES} images at a time`);
        imageInput.value = ""; // Clear the file input
      }
    });
  });
