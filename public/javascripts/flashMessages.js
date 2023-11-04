document.addEventListener("DOMContentLoaded", function () {
  // This code will execute only when the DOM is fully loaded.
  var flashMessage = document.getElementById("flash-message");

  // If the flash message exists, set a timer to remove it
  if (flashMessage) {
    setTimeout(function () {
      flashMessage.classList.remove("show");
      setTimeout(function () {
        flashMessage.remove();
      }, 150);
    }, 3000);
  }
});
