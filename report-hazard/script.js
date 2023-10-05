/**
 * Page Load
 */
const allPages = document.querySelectorAll("section.page");

function displayCurrentSection(event) {
  const pageId = location.hash ? location.hash : "#select-location";
  for (let page of allPages) {
    if (pageId === "#" + page.id) {
      page.style.display = "block";
    } else {
      page.style.display = "none";
    }
  }
  return;
}
displayCurrentSection();

window.addEventListener("hashchange", displayCurrentSection);

/**
 * Hazard Report Form State
 */
class ReportForm {
  constructor() {
    this.categoryId = null;
    this.categoryOptionId = null;
    this.location = {
      lat: null,
      lng: null,
      address: null,
    };
    this.comment = null;
    this.images = [];
  }
}

const currentReport = new ReportForm();

/**
 * Step 1: Location
 */
let map = L.map("map").setView([49.22386, 236.8924], 15);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

map.on("click", onSelectLocation);

function onSelectLocation(event) {
  currentReport.location = {
    lat: event.latlng.lat,
    lng: event.latlng.lng,
    address: "Fake address", //TODO: Get address
  };
}

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
