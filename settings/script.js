//Show user information
import { getUserSession } from "../js/storage.js";

const user = getUserSession();

function showUserInfo() {
  if (user) {
  document.getElementById("name").setAttribute("value", user?.name);
  document.getElementById("email").setAttribute("value", user?.email);
  } else {
    myProfile.style.display = "none"
    deleteAccount.style.display = "none"
  }
}

showUserInfo();

// Change user information


// Change password
changePwBtn.addEventListener("click", (event) => {
  event.preventDefault();
  changePwPopup.style.display = "block";
});

changePwSaveBtn.addEventListener("click", () => {
  changePwPopup.style.display = "none";
});

// Profile photo
function showProfilePic (){
  profilePhoto.setAttribute("src", user?.photo)
}

showProfilePic()

let userPhoto = user?.photo

changeProfilePhotoBtn.onchange = () => {
  const photoURL = URL.createObjectURL(changeProfilePhotoBtn.files[0]);
  userPhoto = photoURL;
  user.photo = userPhoto;
  localStorage.setItem("user", JSON.stringify(user));
  showProfilePic()
};


// Delete profile
deleteAccountBtn.addEventListener("click", () => {
  deleteAccountConfirm.style.display = "block";
});

deleteAccountNoBtn.addEventListener("click", () => {
  deleteAccountConfirm.style.display = "none";
});
