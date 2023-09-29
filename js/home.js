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

document.getElementById("logout-btn").addEventListener("click", () => {
  clearUserSession();
  window.location.reload();
});
