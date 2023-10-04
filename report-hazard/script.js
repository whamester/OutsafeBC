const allPages = document.querySelectorAll("div.page");
allPages[0].style.display = "block";

function displayCurrentSection(event) {
  const pageId = location.hash ? location.hash : "#step1";
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

//init handler for hash navigation
window.addEventListener("hashchange", displayCurrentSection);

// class ReportForm {
//   constructor(location, category, type, details, picture) {
//     this.location = location;
//     this.category = category;
//     this.type = type;
//     this.details = details;
//     this.picture = picture;
//   }
// }

class ReportForm {
  constructor(categoryId, categoryOptionId, location, comment, images) {
    this.categoryId = categoryId;
    this.categoryOptionId = categoryOptionId;
    this.location = location;    
    this.comment = comment;
    this.images = images;
  }
}

// const reportArray = [];

const form = document.getElementById("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const locationInput = form.querySelector("#name");
  // const categoryInput = form.querySelector("#step2")
  const categoryInput = form.querySelector('input[name="category"]:checked');
  // const typeInput = form.querySelector("#step3")
  const typeInput = form.querySelector('input[name="type"]:checked');
  const detailsInput = form.querySelector("#details");
  const pictureInput = form.querySelector("#picture");

  const report = new ReportForm(
    categoryInput.value,
    typeInput.value,
    locationInput.value,
    detailsInput.value,
    pictureInput.value
  );
  console.log(report)
  // reportArray.push(report);
});

// form.addEventListener("button", function(event){
//     event.preventDefault()
//     const locationInput = form.querySelector("#name")
//     console.log(locationInput.value)
// })

function myFu() {
  const locationInput = form.querySelector("#name");
  const categoryInput = form.querySelector('input[name="category"]:checked');
  const typeInput = form.querySelector('input[name="type"]:checked');
  const detailsInput = form.querySelector("#details");
  const pictureInput = form.querySelector("#picture");
  // console.log(locationInput.value)
  window.location.href = "#step6";

  review.innerHTML =
    `1.Location: ${locationInput.value}<br>` +
    `2.Type of hazard: ${categoryInput.value}<br>` +
    `3.Hazard: ${typeInput.value}<br>` +
    `4.Additional details: ${detailsInput.value}<br>` +
    `5.Photos: ${pictureInput.value}<br>`;
}

function confiFu6_7() {
  window.location.href = "#step7";
}

const longitude = 236.8924;
const latitude = 49.22386;

showCoordOnMap(longitude, latitude);

function showCoordOnMap(longitude, latitude) {
  const map = new maplibregl.Map({
    container: "map",
    style:
      "https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
    center: [longitude, latitude],
    zoom: 14.5,
  });
  // add navigation bar to map
  const mapNav = new maplibregl.NavigationControl();
  map.addControl(mapNav, "top-left");
  // add the point as marker to map
  const marker = new maplibregl.Marker()
    .setLngLat([longitude, latitude])
    .addTo(map);
}
document.getElementById("loc").innerHTML = `<pre>longitude: ${longitude}
latitude:  ${latitude}</pre>`;

console.log(`Geolocation: ( lng: ${longitude}, lat: ${latitude} )`);
