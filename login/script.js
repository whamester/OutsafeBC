import { api_url, google_id } from "../constants.js";

/**
 * Google Auth Setup
 */
window.onload = function () {
  google.accounts.id.initialize({
    client_id: google_id,
    callback: async (response) => {
      console.log({ response });
    },
    use_fedcm_for_prompt: true,
  });
  google.accounts.id.renderButton(document.getElementById("google-button"), {
    theme: "outline",
    size: "large",
  });
  google.accounts.id.prompt();
};

/**
 * Login Submit
 */
document
  .getElementById("login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email-input").value;
    const password = document.getElementById("password-input").value;

    const response = await fetch(`${api_url}/auth`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      mode: "no-cors",
    });

    const data = await response.json();
    console.log({ data });
  });
