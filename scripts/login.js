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
