import { api_url } from "../js/constants.js";

const handleCredentialResponse = async (response) => {
  try {
    const result = await fetch(`${api_url}/user?provider=google`, {
      method: "POST",
      body: JSON.stringify(response),
    }).then(async (res) => {
      console.log({ res });
      if (!res.ok) {
        const text = await res.text();
        console.log({ text });
        return text;
      } else {
        return res.json();
      }
    });
    console.log({ result });
  } catch (error) {
    //TODO: handle error
    console.log({ error });
  }
};

window.onload = function () {
  google.accounts.id.initialize({
    client_id:
      "914763218338-qvq8stve1sh2d2g14dcve9kacf51agt8.apps.googleusercontent.com",
    callback: handleCredentialResponse,
    use_fedcm_for_prompt: true,
  });
  google.accounts.id.renderButton(document.getElementById("google-button"), {
    theme: "outline",
    size: "large",
  });
  google.accounts.id.prompt();
};
