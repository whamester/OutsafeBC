import { api_url } from "./constants.js";
import { clearUserSession, getUserSession } from "./storage.js";

window.onload = function () {
  const user = getUserSession();

  const logoutBtn = document.getElementById("logout-btn");
  if (user?.email) {
    document.getElementById("username").innerHTML = user.email;
    logoutBtn.style.display = "inline";
  } else {
    logoutBtn.style.display = "none";
  }
};

document.getElementById("logout-btn").addEventListener("click", async () => {
  const user = getUserSession();

  if (!!user?.auth?.currentUser) {
    try {
      await fetch(`${api_url}/signout`, {
        method: "POST",
        body: JSON.stringify(user.auth),
      });
    } catch (error) {
      console.debug(error);
    }
  }
  clearUserSession();
  window.location.reload();
});
