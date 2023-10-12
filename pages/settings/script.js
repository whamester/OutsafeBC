//Show user information
import { getUserSession, setUserSession } from "../../assets/helpers/storage.js";

const user = getUserSession();

function showUserInfo() {
  if (user) {
    document.getElementById("name").setAttribute("value", user?.name);
    document.getElementById("email").setAttribute("value", user?.email);
  } else {
    myProfile.style.display = "none";
    deleteAccount.style.display = "none";
  }
}

showUserInfo();

// Change user information
let userName = user?.name;
let userEmail = user?.email;

saveProfileInfoBtn.addEventListener("click", () => {
  userName = document.getElementById("name").value;
  user.name = userName;
  userEmail = document.getElementById("email").value;
  user.email = userEmail;
  setUserSession(user);
  showProfilePic();
});

// Change password
function togglePwModal() {
  const pwModal = changePwPopup.style;
  pwModal.display = pwModal.display === "block" ? "none" : "block";
}

changePwBtn.addEventListener("click", togglePwModal);

changePwSaveBtn.addEventListener("click", togglePwModal);

// Profile photo

function showProfilePic() {
  profilePhoto.setAttribute("src", user?.photo);
}

showProfilePic();

const dropArea = document.getElementById("fileDropWrapper");

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();

  const picture = e.dataTransfer.files[0];
  const fileType = picture.type;

  if (
    fileType == "image/png" ||
    fileType == "image/jpg" ||
    fileType == "image/jpeg"
  ) {
    let userPhoto = user?.photo;

    const photoURL = URL.createObjectURL(picture);
    userPhoto = photoURL;
    user.photo = userPhoto;
    setUserSession(user);
    showProfilePic();
  }
});

// Delete profile
function toggleDelModal() {
  const delModal = deleteAccountConfirm.style;
  delModal.display = delModal.display === "block" ? "none" : "block";
}

deleteAccountBtn.addEventListener("click", toggleDelModal);

deleteAccountNoBtn.addEventListener("click", toggleDelModal);
