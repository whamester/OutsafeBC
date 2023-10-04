const allPages = document.querySelectorAll("section.page");
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

window.addEventListener("hashchange", displayCurrentSection);

class ReportForm {
  constructor(categoryId, categoryOptionId, location, comment, images) {
    this.categoryId = categoryId;
    this.categoryOptionId = categoryOptionId;
    this.location = location;
    this.comment = comment;
    this.images = images;
  }
}

const form = document.getElementById("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const locationInput = lat_lng;
  const categoryInput = form.querySelector('input[name="category"]:checked');
  const typeInput = form.querySelector('input[name="type"]:checked');
  const detailsInput = form.querySelector("#details");
  const pictureInput = form.querySelector("#picture");

  const report = new ReportForm(
    categoryInput.value,
    typeInput.value,
    locationInput,
    detailsInput.value,
    pictureInput.value
  );
  console.log(report);
});

function myFu() {
  const locationInput = lat_lng;
  const categoryInput = form.querySelector('input[name="category"]:checked');
  const typeInput = form.querySelector('input[name="type"]:checked');
  const detailsInput = form.querySelector("#details");
  const pictureInput = form.querySelector("#picture");
  window.location.href = "#step6";

  lable.innerHTML =
    `1.Location: ` +
    `2.Type of hazard: ` +
    `3.Hazard: ` +
    `4.Additional details: ` +
    `5.Photos: `;

  value.innerHTML =
    ` ${locationInput}` +
    ` ${categoryInput.value}` +
    ` ${typeInput.value}` +
    ` ${detailsInput.value}` +
    ` ${pictureInput.value}`;
}

function confiFu6_7() {
  window.location.href = "#step7";
}

let map = L.map("map").setView([49.22386, 236.8924], 15);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

map.on("click", onMapClick);

let lat_lng = "";

function onMapClick(e) {
  lat_lng = e.latlng;
  console.log(e.latlng);
  console.log(lat_lng);
}
