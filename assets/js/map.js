var greenIcon = new L.Icon({
  iconUrl: "/assets/img/icons/icon-map-pin.png",
})

const displayMap = (lat, lng) => {
  const map = L.map('map', {zoomControl: false}).setView([lat, lng], 11)
  .on("locationfound", e => {
    console.log(e);
  });
  L.marker([lat, lng], { icon: greenIcon }).addTo(map);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
}

const getUserLoaction = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Get the user's latitude and longitude coordinates
        const {latitude, longitude} = position.coords
        displayMap(latitude, longitude)
      },
      (error) => {
        displayMap(49.20, -123.12)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser!!!");
  }
}

getUserLoaction()
