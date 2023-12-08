import geolocationDistance from '../helpers/geolocation-distance.js';
import { getUserLocation } from '../helpers/user-geocoordinates.js';
import DateFormat from '../models/DateFormat.js';
import Map from '../models/Map.js';

const HazardCardLayout = ({ reports }) => {
  const userLocation = getUserLocation();

  const position = userLocation || Map.DEFAULT_LOCATION;

  return reports
    ? `<div class="sb-cards">
    <button class="sb-cards-btn--back">
      <i class="icon-close-square" style="background-color: var(--neutral-500)"></i>
    </button>
    <div class="sb-cards-outer">
      <div class="sb-cards-header">
        <p class="sb-label-title">Recent Hazards</p>
        <p class="sb-label-count">(${reports.length} search results)</p>
      </div>
      <div class="sb-cards-wrapper d-grid">
        ${reports
          ?.map((item) => ({ ...item, distance: geolocationDistance(item.location.lat, item.location.lng, position.lat, position.lng) }))
          ?.sort((prev, curr) => {
            if (Number(prev.distance) > Number(curr.distance)) {
              return 1;
            }
            return -1;
          })
          ?.map((item, idx) => {
            const location = item?.location?.address ?? `${item?.location?.lat}, ${item?.location?.lng}`;
            const dateObj = new Date(item.created_at);
            const date = DateFormat.getDate(dateObj);
            const time = DateFormat.getTime(dateObj);
            const id = item.id;

            return `
            <div
              class="sb-cards--item"
              id="sb-card-${idx + 1}"  
              data-details='${JSON.stringify(item)}'>
      
              <div class="report-card__heading">
                <span class="btn__icon report-card__heading__icon" style="background-color: ${item.hazardCategory.settings.iconBackround}">
                  <i class="${item.hazardCategory.settings.icon}-outline" style="width:24px; height:24px; background-color: white"></i>
                </span>
                    <p class="text-body-1 semibold">${item.hazardCategory.name}</p>
              </div>
              <div class="report-card__details sb-cards-info--box">
                <i class="icon-location-pin-outline" style="background-color: var(--neutral-400)"></i>
                <p class="text-body-2 regular">${location}</p>
              </div>
      
              <div class="report-card__date_time sb-cards-info--box">
                <div class="report-card__details">
                  <i class="icon-date" style="background-color: var(--neutral-400)"></i>
                  <p class="text-body-2 regular">${date}</p>
                </div>
              
                <div class="report-card__details">
                  <i class="icon-time" style="background-color: var(--neutral-400)"></i>
                  <p class="text-body-2 regular">${time}</p>
                </div>
              </div>
      
              <div class="report-card__details sb-cards-info--box">
                <i class="icon-distance" style="background-color: var(--neutral-400)"></i>
                <p class="text-body-2 regular">${item.distance} km away</p>
              </div>
      
              <button data-id="${id}" class="btn btn-secondary view-details" id="viewDetailsBtn">
                  <i class="icon-plus"></i>
                  View Deatils
              </button>
            </div>
          `;
          })
          .join('')}

        <div class="sb-cards--gradient"></div>
      </div>
    </div>
  </div>`
    : '';
};

export default HazardCardLayout;
