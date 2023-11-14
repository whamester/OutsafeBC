import geolocationDistance from '../helpers/geolocation-distance.js';
import DateFormat from '../models/DateFormat.js';

const HazardCardLayout = ({ reports, position }) => {
  return reports
    ? `<div class="sb-cards">
    <button class="sb-cards-btn--back"
      onclick="document.querySelector('.sb-cards').remove(); document.querySelector('.btn-report-hazard').style.display = 'flex'; searchInput.value=''; searchInput.dataset.positionChange='false'">
      <img src="/assets/icons/chevron-left.svg" />Back
    </button>
    <div class="sb-cards-wrapper d-grid">
      ${reports
        ?.map((item, idx) => {
          const location =
            item?.location?.address ??
            `${item?.location?.lat}, ${item?.location?.lng}`;
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
              <span class="btn__icon report-card__heading__icon" style="background-color: ${
                item.hazardCategory.settings.iconBackround
              }">
                <i class="${
                  item.hazardCategory.settings.icon
                }-outline" style="width:24px; height:24px; background-color: white"></i>
              </span>
                  <p class="text-body-1 semibold">${
                    item.hazardCategory.name
                  }</p>
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
              <p class="text-body-2 regular">${geolocationDistance(
                item.location.lat,
                item.location.lng,
                position.lat,
                position.lng
              )} km away</p>
            </div>

            <button data-id="${id}" class="btn btn-secondary view-details" id="viewDetailsBtn">
                <i class="icon-plus"></i>
                View Deatils
            </button>
          </div>
        `;
        })
        .join('')}
    </div>
  </div>`
    : '';
};

export default HazardCardLayout;
