// User information
import { getUserSession } from "../../assets/helpers/storage.js";

const user = getUserSession();
function showUserInfo() {
  document.getElementById("name").setAttribute("value", user.name);
  document.getElementById("email").setAttribute("value", user.email);
}

showUserInfo();

// Change password
changePwBtn.addEventListener("click", (event) => {
  event.preventDefault();
  changePwPopup.style.display = "block";
});

changePwSaveBtn.addEventListener("click", () => {
  changePwPopup.style.display = "none";
});

// Profile photo
changeProfilePhotoBtn.onchange = () => {
  profilePhoto.src = URL.createObjectURL(changeProfilePhotoBtn.files[0]);
};

// Delete profile
deleteAccountBtn.addEventListener("click", () => {
  deleteAccountConfirm.style.display = "block";
});

deleteAccountNoBtn.addEventListener("click", () => {
  deleteAccountConfirm.style.display = "none";
});
