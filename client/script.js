import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.getElementById("chat-container");

let loadInterval;

function botTypingLoader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent.length > 3) {
      element.textContent = "";
    }
  }, 300);
}

function botTypingText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 25);
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumb = Math.random();
  const hexadecimalStr = randomNumb.toString(16);

  return `id-${timestamp}-${hexadecimalStr}`;
}

function chatStripe(isBot, value, uniqueId) {
  return `
      <div class="wrapper ${isBot ? "bot" : "user"}">
          <div class="chat">
              <div class="profile">
                  <img 
                    src=${isBot ? bot : user} 
                    alt="${isBot ? "bot" : "user"}" 
                  />
              </div>
              <div class="message" id=${uniqueId}>${value}</div>
          </div>
      </div>
  `;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // user
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  form.reset();

  // bot
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageContainer = document.getElementById(uniqueId);

  botTypingLoader(messageContainer);

  const response = await fetch("http://localhost:4000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });

  clearInterval(loadInterval);
  chatContainer.innerHTML = "";

  if (response.ok) {
    const data = await response.json();
    const parsed = data.bot.trim();

    botTypingText(chatContainer, parsed);
  } else {
    const error = await response.text();

    chatContainer.innerHTML = "Error Something Went Wrong";

    console.error(error);
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
