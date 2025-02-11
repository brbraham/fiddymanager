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
  const pass = generatePassword(8);
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
      passCell.classList.add("blur");
    }

    const deleteCell = row.insertCell();
    deleteCell.innerHTML = `<button onclick="deleteSam(${index})"><i class="fa fa-trash"></i></button>`;
  });
}

const sortingSelect = document.getElementById("sorting");
sortingSelect.addEventListener("change", function () {
  displaySams();
});

function generatePassword() {
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
    sams = JSON.parse(data);
    displaySams();
  }
}

document.addEventListener("DOMContentLoaded", loadData);

let timeout;
let interval;
const inactivityDuration = 60 * 1000; // 60 second timeout
const timerDisplay = document.querySelector("#time"); //
function showTimer() {
  if (timerDisplay) timerDisplay.style.display = "block";
}
function hideTimer() {
  if (timerDisplay) timerDisplay.style.display = "none";
}
function startTimer(duration) {
  let timer = duration,
    minutes,
    seconds;
  showTimer();
  clearInterval(interval);
  interval = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    if (timerDisplay) timerDisplay.textContent = minutes + ":" + seconds;
    if (--timer < 0) {
      clearInterval(interval);
      showModal();
      hideTimer();
      logout();
    }
  }, 1000);
}
function resetTimer() {
  clearTimeout(timeout);
  clearInterval(interval);
  hideTimer();

  timeout = setTimeout(function () {
    startTimer(inactivityDuration / 1000);
  }, inactivityDuration);
}
function setupInactivityTimer() {
  window.onload = resetTimer;
  document.onmousemove = resetTimer;
  document.onclick = resetTimer;
  document.onmousemove = function () {
    resetTimer();
  };
  document.onclick = function () {
    resetTimer();
  };
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
  modal.classList.add("show");
  document.querySelector(".content-wrapper").classList.add("blur-background");
}

function hideModal() {
  var modal = document.getElementById("myModal");
  modal.classList.remove("show");
  document
    .querySelector(".content-wrapper")
    .classList.remove("blur-background");
}

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

  document.getElementById("website").value = "";
  document.getElementById("username").value = "";
  saveData();
  displaySams();

  document.getElementById("passwordBtn").style.backgroundColor = "";
  document.getElementById("passphraseBtn").style.backgroundColor = "";
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

function getCurrentUser() {
  const user = firebase.auth().currentUser;
  if (user) {
    return user;
  } else {
    return null;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const currentUser = getCurrentUser();
  const currentUserElement = document.getElementById("currentUser");
  if (currentUser && currentUser.email) {
    currentUserElement.textContent =
      "Currently logged in as: " + currentUser.email;
  } else {
    currentUserElement.textContent = "Not Logged In";
    //window.location.href = "login.html";
  }
});
