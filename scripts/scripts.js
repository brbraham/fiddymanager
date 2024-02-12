let sams = [];

document.addEventListener("DOMContentLoaded", function () {
  loadData();
  document.getElementById("okButton").onclick = function () {
    hideModal();
    resetTimer();
    // Uncomment the next line to redirect when modal OK is clicked
    // window.location.href = "login.html";
  };
  setupInactivityTimer();
});

function addSam() {
  const website = document.getElementById("website").value;
  const username = document.getElementById("username").value;
  const pass = generateRandomString(8);
  const created = new Date();
  let expires = new Date();
  expires.setMonth(expires.getMonth() + 6);

  // Format expires as "Month DD, YYYY"
  const options = { year: "numeric", month: "long", day: "numeric" };
  const createdFormatted = created.toLocaleDateString("en-us", options);
  const expiresFormatted = expires.toLocaleDateString("en-US", options);

  // Create a new 'sam' object with dynamically set 'created' and 'expires' dates
  const sam = {
    website,
    username,
    pass,
    created: createdFormatted,
    expires: expiresFormatted,
  };
  sams.push(sam);

  // Clear input fields
  document.getElementById("website").value = "";
  document.getElementById("username").value = "";
  saveData();
  displaySams();
}

function deleteSam(index) {
  sams.splice(index, 1); // Remove the 'sam' object from the array
  saveData();
  displaySams(); // Update the table
}

function displaySams() {
  const tableBody = document
    .getElementById("data-table")
    .getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";

  // Sort the sams array based on the selected sorting option
  const sortingOption = document.getElementById("sorting").value;
  switch (sortingOption) {
    case "newest":
      sams.sort((a, b) => new Date(b.created) - new Date(a.created));
      break;
    case "oldest":
      sams.sort((a, b) => new Date(a.created) - new Date(b.created));
      break;
    case "ascending":
      sams.sort((a, b) => a.website.localeCompare(b.website));
      break;
    case "descending":
      sams.sort((a, b) => b.website.localeCompare(a.website));
      break;
    default:
      break;
  }

  // Display the sorted sams
  sams.forEach((sam, index) => {
    const row = tableBody.insertRow();
    row.classList.add("unblur-on-hover");
    Object.values(sam).forEach((text) => {
      const cell = row.insertCell();
      cell.innerText = text;
    });

    // Apply CSS classes based on the cell content to blur the passwords
    const passCell = row.getElementsByTagName("td")[2];
    if (passCell.innerText.match(/[a-zA-Z0-9]{8}/)) {
      passCell.classList.add("blur");
    } else if (passCell.innerText.trim() !== "") {
      // Check if the password is not empty
      passCell.classList.add("blur");
    }

    const deleteCell = row.insertCell();
    deleteCell.innerHTML = `<button onclick="deleteSam(${index})"><i class="fa fa-trash"></i></button>`;
  });
  // Add an event listener to the sorting select element
}

// Add an event listener to the sorting select element
const sortingSelect = document.getElementById("sorting");
sortingSelect.addEventListener("change", function () {
  displaySams();
});

function generatePassword() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=-";
  let password = "";
  for (let i = 0; i < 9; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}

function generatePassphrase() {
  const pass = wordOptions
    .sort(() => 0.5 - Math.random())
    .slice(0, 4)
    .join("");
  return pass;
}

function saveData() {
  localStorage.setItem("tableData", JSON.stringify(sams));
}

function loadData() {
  const data = localStorage.getItem("tableData");
  if (data) {
    sams = JSON.parse(data); // Converts JSON string back to an array
    displaySams(); // Function to display your table data
  }
}

document.addEventListener("DOMContentLoaded", loadData);

let timeout;
let interval; // Global variable to keep track of the interval ID
const inactivityDuration = 10 * 1000; // 10 seconds for demonstration
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
  document.onkeypress = resetTimer;
  document.onclick = resetTimer;

  // Reset the popup when the user becomes active
  document.onmousemove = function () {
    resetTimer();
  };
  document.onkeypress = function () {
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

function resetPopup() {
  var modal = document.getElementById("myModal");
  if (modal.classList.contains("show")) {
    modal.classList.remove("show");
    document
      .querySelector(".content-wrapper")
      .classList.remove("blur-background");
  }
  if (document.getElementById("popup").style.display === "block") {
    closePopup();
  }
}

// Function to open the popup
function openPopup() {
  document.getElementById("popup").style.display = "block";
}
// Function to close the popup
function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// Set initial state of buttons
passwordBtn.style.backgroundColor = "";
passphraseBtn.style.backgroundColor = "";

passwordBtn.addEventListener("click", function () {
  passwordBtn.style.backgroundColor = "#39b7ff";
  passphraseBtn.style.backgroundColor = "";
});

passphraseBtn.addEventListener("click", function () {
  passphraseBtn.style.backgroundColor = "#39b7ff";
  passwordBtn.style.backgroundColor = "";
});

function addSam() {
  const website = document.getElementById("website").value;
  const username = document.getElementById("username").value;

  if (!website || !username) {
    alert(
      "Please enter a website and username before creating a new password or passphrase."
    );
    return;
  }

  let pass;
  if (
    document.getElementById("passwordBtn").style.backgroundColor ===
    "rgb(57, 183, 255)"
  ) {
    pass = generatePassword(1).toUpperCase();
  } else if (
    document.getElementById("passphraseBtn").style.backgroundColor ===
    "rgb(57, 183, 255)"
  ) {
    pass = generatePassphrase();
  } else {
    alert(
      "Please select a password type before creating a new password or passphrase."
    );
    return;
  }

  const created = new Date();
  let expires = new Date();
  expires.setMonth(expires.getMonth() + 6);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const createdFormatted = created.toLocaleDateString("en-us", options);
  const expiresFormatted = expires.toLocaleDateString("en-US", options);

  const sam = {
    website,
    username,
    pass,
    created: createdFormatted,
    expires: expiresFormatted,
  };
  sams.push(sam);

  // Clear input fields
  document.getElementById("website").value = "";
  document.getElementById("username").value = "";
  saveData();
  displaySams();

  // Reset button colors
  document.getElementById("passwordBtn").style.backgroundColor = "";
  document.getElementById("passphraseBtn").style.backgroundColor = "";
}

function logout() {
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

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const wordOptions = [
  "time",
  "way",
  "year",
  "work",
  "government",
  "day",
  "man",
  "world",
  "life",
  "part",
  "house",
  "course",
  "case",
  "system",
  "place",
  "end",
  "group",
  "company",
  "party",
  "information",
  "school",
  "fact",
  "money",
  "point",
  "example",
  "state",
  "business",
  "night",
  "area",
  "water",
  "thing",
  "family",
  "head",
  "hand",
  "order",
  "john",
  "side",
  "home",
  "development",
  "week",
  "power",
  "country",
  "council",
  "use",
  "service",
  "room",
  "market",
  "problem",
  "court",
  "lot",
  "a",
  "war",
  "police",
  "interest",
  "car",
  "law",
  "road",
  "form",
  "face",
  "education",
  "policy",
  "research",
  "sort",
  "office",
  "body",
  "person",
  "health",
  "mother",
  "question",
  "period",
  "name",
  "book",
  "level",
  "child",
  "control",
  "society",
  "minister",
  "view",
  "door",
  "line",
  "community",
  "south",
  "city",
  "god",
  "father",
  "centre",
  "effect",
  "staff",
  "position",
  "kind",
  "job",
  "woman",
  "action",
  "management",
  "act",
  "process",
  "north",
  "age",
  "evidence",
  "idea",
  "west",
  "support",
  "moment",
  "sense",
  "report",
  "mind",
  "church",
  "morning",
  "death",
  "change",
  "industry",
  "land",
  "care",
  "century",
  "range",
  "table",
  "back",
  "trade",
  "history",
  "study",
  "street",
  "committee",
  "rate",
  "word",
  "food",
  "language",
  "experience",
  "result",
  "team",
  "other",
  "sir",
  "section",
  "programme",
  "air",
  "authority",
  "role",
  "reason",
  "price",
  "town",
  "class",
  "nature",
  "subject",
  "department",
  "union",
  "bank",
  "member",
  "value",
  "need",
  "east",
  "practice",
  "type",
  "paper",
  "date",
  "decision",
  "figure",
  "right",
  "wife",
  "president",
  "university",
  "friend",
  "club",
  "quality",
  "voice",
  "lord",
  "stage",
  "king",
  "us",
  "situation",
  "light",
  "tax",
  "production",
  "march",
  "secretary",
  "art",
  "board",
  "may",
  "hospital",
  "month",
  "music",
  "cost",
  "field",
  "award",
  "issue",
  "bed",
  "project",
  "chapter",
  "girl",
  "game",
  "amount",
  "basis",
  "knowledge",
  "approach",
  "series",
  "love",
  "top",
  "news",
  "front",
  "future",
  "manager",
  "account",
  "computer",
  "security",
  "rest",
  "labour",
  "structure",
  "hair",
  "bill",
  "heart",
  "force",
  "attention",
  "movement",
  "success",
  "letter",
  "agreement",
  "capital",
  "analysis",
  "population",
  "environment",
  "performance",
  "model",
  "material",
  "theory",
  "growth",
  "fire",
  "chance",
  "boy",
  "relationship",
  "son",
  "sea",
  "record",
  "size",
  "property",
  "space",
  "term",
  "director",
  "plan",
  "behaviour",
  "treatment",
  "energy",
  "st",
  "peter",
  "income",
  "cup",
  "scheme",
  "design",
  "response",
  "association",
  "choice",
  "pressure",
  "hall",
  "couple",
  "technology",
  "defence",
  "list",
  "chairman",
  "loss",
  "activity",
  "contract",
  "county",
  "wall",
  "paul",
  "difference",
  "army",
  "hotel",
  "sun",
  "product",
  "summer",
  "set",
  "village",
  "colour",
  "floor",
  "season",
  "unit",
  "park",
  "hour",
  "investment",
  "test",
  "garden",
  "husband",
  "employment",
  "style",
  "science",
  "look",
  "deal",
  "charge",
  "help",
  "economy",
  "new",
  "page",
  "risk",
  "advice",
  "event",
  "picture",
  "commission",
  "fish",
  "college",
  "oil",
  "doctor",
  "opportunity",
  "film",
  "conference",
  "operation",
  "application",
  "press",
  "extent",
  "addition",
  "station",
  "window",
];

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvaqJ-s7imh09Xp95rbGD8O5twjMCfJPk",
  authDomain: "capstoneproject-71f4c.firebaseapp.com",
  projectId: "capstoneproject-71f4c",
  storageBucket: "capstoneproject-71f4c.appspot.com",
  messagingSenderId: "359918716352",
  appId: "1:359918716352:web:4a1f65791b99eacb797425",
  measurementId: "G-9ZGHGKVENP",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const auth = getAuth(firebaseApp);

// Function to perform login authentication
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Retrieve email and password from form
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Sign in with email and password using Firebase Authentication
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Redirect to dashboard upon successful login
        window.location.href = "Dashboard.html"; // Redirect to dashboard upon successful login
      })

      .catch((error) => {
        // Handle login errors
        const errorCode = error.code;
        let errorMessage;

        switch (errorCode) {
          case "auth/user-not-found":
            errorMessage =
              "User not found. Please check your email and try again.";
            break;
          case "auth/wrong-password":
            errorMessage = "Incorrect password. Please try again.";
            break;
          // You can add more cases to handle other error codes as needed
          default:
            errorMessage = "An error occurred. Please try again later.";
            break;
        }

        document.getElementById("errorText").innerText = errorMessage;
        document.getElementById("errorText").style.display = "block";
      });
  });
// Function to switch to new user form
document
  .querySelector(".new-user-text")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("newUserContainer").style.display = "block";
  });

// Function to switch back to login form
document
  .querySelector(".back-to-login")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("newUserContainer").style.display = "none";
    document.getElementById("loginContainer").style.display = "block";
  });

// Function to handle forgot password
document
  .querySelector(".forgot-password")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const email = prompt("Please enter your email to reset password:");
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          // Password reset email sent
          alert("Password reset email sent. Please check your email.");
        })
        .catch((error) => {
          // Handle errors
          console.error("Error sending password reset email:", error.message);
          alert("Error sending password reset email. Please try again.");
        });
    }
  });

// Function to create new user
document
  .getElementById("createUserForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission
    const username = document.getElementById("newUsername").value;
    const email = document.getElementById("newUserEmail").value;
    const password = document.getElementById("newUserPassword").value;
    const confirmPassword = document.getElementById(
      "confirmNewUserPassword"
    ).value;

    // Validate password strength
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(password)) {
      document.getElementById("newUserErrorText").innerText =
        "Password must be between 8-16 characters long and contain at least one number and one special character (!@#$%^&*).";
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      document.getElementById("newUserErrorText").innerText =
        "Passwords do not match. Please try again.";
      return;
    }

    // Create new user with Firebase authentication
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User registered successfully
        var user = userCredential.user;
        console.log("User registered:", user.uid);
        // Display success message
        document.getElementById("successMessage").innerText =
          "User registered successfully!";
        document.getElementById("successMessage").style.display = "block";
        // Redirect to login page after a delay (e.g., 3 seconds)
        setTimeout(() => {
          window.location.href = "login.html";
        }, 3000); // 3000 milliseconds = 3 seconds
      })
      .catch((error) => {
        // Handle registration errors
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage);
        // You can display the error message to the user or perform other actions as needed
        document.getElementById("errorText").innerText = errorMessage;
        document.getElementById("errorText").style.display = "block";
      });
  });
