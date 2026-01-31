const correctPassword = "Rocher0604"; 
let attempts = 0;

const input = document.getElementById("password-input");
const submitBtn = document.getElementById("submit-password");
const errorMessage = document.getElementById("error-message");
const hintButton = document.getElementById("hint-button");
const hintText = document.getElementById("hint-text");

const passwordGate = document.getElementById("password-gate");
const homeContent = document.getElementById("home-content");

// Check if site was already unlocked in this session
if (sessionStorage.getItem("siteUnlocked") === "true") {
  // If already unlocked, show home content immediately without animation
  passwordGate.style.display = "none";
  homeContent.classList.remove("hidden");
}

submitBtn.addEventListener("click", checkPassword);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkPassword();
});

function checkPassword() {
  const value = input.value.trim();

  if (value === correctPassword) {
    unlockSite();
  } else {
    attempts++;
    errorMessage.textContent = "Hmm… that's not it.";

    // Trigger shake animation
    errorMessage.classList.remove("shake");
    // Force reflow to reset animation
    void errorMessage.offsetWidth;
    errorMessage.classList.add("shake");

    if (attempts >= 3) {
      hintButton.classList.remove("hidden");
    }
  }
}

hintButton.addEventListener("click", () => {
  hintText.classList.remove("hidden");
});

function unlockSite() {
  // Store unlock state in sessionStorage
  sessionStorage.setItem("siteUnlocked", "true");
  
  passwordGate.style.opacity = "0";
  passwordGate.style.pointerEvents = "none";

  setTimeout(() => {
    passwordGate.style.display = "none";
    homeContent.classList.remove("hidden");
  }, 600);
}


const gif = document.getElementById("wish-gif");
const message = document.getElementById("wish-message");

gif.addEventListener("click", () => {
  gif.style.opacity = "0.85"; // subtle dim effect
  message.classList.remove("hidden");

  setTimeout(() => {
    message.classList.add("show");
  }, 50);
});


