document.addEventListener("DOMContentLoaded", loadData);

document.addEventListener("DOMContentLoaded", function () {
  loadData();
  document.getElementById("okButton").onclick = function () {
    hideModal();
    resetTimer();
    logout();
  };
  setupInactivityTimer();
});

let timeout;
let interval; // Global variable to keep track of the interval ID
const inactivityDuration = 60 * 1000;
const timerDisplay = document.querySelector("#time"); // Assuming this is your timer display element
function showTimer() {
  if (timerDisplay) timerDisplay.style.display = "block"; // Show the timer display
}
function hideTimer() {
  if (timerDisplay) timerDisplay.style.display = "none"; // Hide the timer display
}
function startTimer(duration) {
  let timer = duration,
    minutes,
    seconds;
  showTimer(); // Make sure to show the timer when starting the countdown
  // Clear existing interval to ensure no multiple intervals running
  clearInterval(interval);
  interval = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    if (timerDisplay) timerDisplay.textContent = minutes + ":" + seconds;
    if (--timer < 0) {
      clearInterval(interval);
      showModal(); // Your action when the timer expires
      hideTimer(); // Hide the timer display once the countdown is complete
    }
  }, 1000);
}
function resetTimer() {
  clearTimeout(timeout); // Clear the timeout
  clearInterval(interval); // Also clear the interval to stop the countdown
  hideTimer(); // Hide the timer immediately upon reset

  timeout = setTimeout(function () {
    startTimer(inactivityDuration / 1000);
  }, inactivityDuration);
}
function setupInactivityTimer() {
  window.onload = resetTimer;
  document.onmousemove = resetTimer;
  document.onclick = resetTimer;

  // Reset the popup when the user becomes active
  document.onmousemove = function () {
    resetTimer();
  };
  document.onclick = function () {
    resetTimer();
  };

  // Initially hide the timer until it's needed
  hideTimer();
}
document.addEventListener("DOMContentLoaded", function () {
  loadData();
  document.getElementById("okButton").onclick = function () {
    hideModal();
    resetTimer();
  };
  setupInactivityTimer();
});

function showModal() {
  var modal = document.getElementById("myModal");
  modal.classList.add("show"); // Show the modal
  document.querySelector(".content-wrapper").classList.add("blur-background"); // Blur background
}

function hideModal() {
  var modal = document.getElementById("myModal");
  modal.classList.remove("show"); // Hide the modal
  document
    .querySelector(".content-wrapper")
    .classList.remove("blur-background"); // Remove blur
}

function logout() {
  window.location.href = "login.html";
  firebase
    .auth()
    .signOut()
    .then(function () {
      // Sign-out successful.
      // Redirect the user to the login page or perform any other action after logout.
      window.location.href = "login.html";
    })
    .catch(function (error) {
      // An error happened.
      console.error("Logout error:", error);
    });
}
