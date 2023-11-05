// for preventing double submission
document.addEventListener("DOMContentLoaded", (event) => {
  const forms = document.querySelectorAll(".single-submission-form");
  forms.forEach((form) => {
    const submitBtn = form.querySelector(".single-submission-btn");
    form.addEventListener("submit", (event) => {
      if (submitBtn && form.checkValidity()) {
        submitBtn.disabled = true;
      }
    });
  });
});
