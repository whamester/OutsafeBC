// Geolocation toggle (not going to be able to toggle)

const geolocationSwitch = document.getElementById("geolocation-switch");

// Check if geolocation is enabled
navigator.permissions
  .query({ name: "geolocation" })
  .then((permissionStatus) => {
    if (permissionStatus.state === "granted") {
      geolocationSwitch.checked = true;
      getLocation();
    } else {
      geolocationSwitch.checked = false;
    }
  });

geolocationSwitch.addEventListener("change", locationSwitch);

function locationSwitch() {
  if (geolocationSwitch.checked) {
    getLocation();
  } else {
    console.log("Geolocation is disabled.");
  }
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  console.log(
    `Your current location is: Latitude ${latitude}, Longitude ${longitude}`
  );
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("User denied the request for geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.");
      break;
  }
}

// Display user details:

// Profile photo
let profilePhoto = document.getElementById("profile-photo");
let inputPhoto = document.getElementById("change-profile-photo-btn");

inputPhoto.onchange = () => {
    profilePhoto.src = URL.createObjectURL(inputPhoto.files[0])
}

// testing:

// permission checker
navigator.permissions.query({ name: "camera" }).then((res) => {
  res.onchange = (e) => {
    // detecting if the event is a change
    if (e.type === "change") {
      // checking what the new permissionStatus state is
      const newState = e.target.state;
      if (newState === "denied") {
        console.log("Permission blocked");
      } else if (newState === "granted") {
        console.log("Permission granted");
      } else {
        console.log("Permission default");
      }
    }
  };
});
