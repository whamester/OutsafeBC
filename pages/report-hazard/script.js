//Models
import ReportForm from "../../assets/models/ReportForm.js";
import Map from "../../assets/models/Map.js";

//Variable Declaration
const currentReport = new ReportForm();
let position = Map.DEFAULT_LOCATION;
let map = null;

/**
 * Page Init
 */

window.onload = function () {
  displayCurrentSection();
  window.addEventListener("hashchange", displayCurrentSection);

  // Loads the map even if the user has not accepted the permissions
  map = new Map(position);
  map.setMarkerOnMap(position.latitude, position.longitude, "You", {
    draggable: true,
  }); //TODO: Consult with design the message of the marker

  //Override the current location if the user accepts the permissions
  loadGeolocation();
};

const displayCurrentSection = () => {
  const allPages = document.querySelectorAll("section.page");

  const pageId = location.hash ? location.hash : "#select-location";
  for (let page of allPages) {
    if (pageId === "#" + page.id) {
      page.style.display = "block";
    } else {
      page.style.display = "none";
    }
  }
};

const loadGeolocation = async () => {
  position = await Map.getCurrentLocation();
  map.setMarkerOnMap(position.latitude, position.longitude, "You", {
    draggable: true,
  });
};

/**
 * Step 1: Location
 */

if (map) {
  map.on("click", onSelectLocation);
}

const onSelectLocation = (event) => {
  map.removeLayer(marker);
  map.setMarkerOnMap(event.latlng.lat, event.latlng.lng, "Location selected", {
    draggable: true,
  });

  currentReport.location = {
    lat: event.latlng.lat,
    lng: event.latlng.lng,
    address: "Fake address", //TODO: Get address
  };
};

/**
 * Step 2: Category List
 */
document
  .querySelectorAll('[name="categoryRadioBtn"]')
  .forEach((categoryElement) => {
    categoryElement.addEventListener("change", (event) => {
      window.location.href = "#hazard-type"; //TODO: Review this, because is hard for the user when you are using the keyboard

      currentReport.categoryId = event.target.value;
    });
  });

/**
 * Step 3: Hazard Options List
 */
document
  .querySelectorAll('[name="hazardOptionRadioBtn"]')
  .forEach((categoryElement) => {
    categoryElement.addEventListener("change", (event) => {
      window.location.href = "#additional-details"; //TODO: Review this, because is hard for the user when you are using the keyboard
      currentReport.categoryOptionId = event.target.value;
    });
  });

/**
 * Step 4: Comments
 */
commentInput.addEventListener("change", (event) => {
  currentReport.comment = event.target.value;
});

/**
 * Step 5: Images
 * Pending
 */

/**
 * Step 6: Show Confirmation
 */
showConfirmationBtn.addEventListener("click", () => {
  locationOutput.innerHTML = `${currentReport.location.address} (${currentReport.location.lat},${currentReport.location.lng})`;
  categoryOutput.innerHTML = currentReport.categoryId;
  hazardOptionOutput.innerHTML = currentReport.categoryOptionId;
  commentOutput.innerHTML = currentReport.comment;
});

/**
 * Submit Form
 */
reportHazardForm.addEventListener("submit", function (event) {
  event.preventDefault();
  console.log(currentReport);
  //TODO: Hit create hazard report endpoint
});
