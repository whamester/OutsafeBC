const HazardCard = ({ reports }) => {
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
          const date = dateObj.toLocaleString('default', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
          const time = dateObj.toLocaleTimeString('default', {
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
          });

          return `
          <div
            class="sb-cards--item"
            id="sb-card-${idx + 1}"  
            data-details='${JSON.stringify(item)}'>
            <div class="sb-card-header--box">
              <h2 class="sb-card-header--txt">${item.hazardCategory?.name}</h2>
            </div>

            <div class="sb-cards-info--box">
              <p>${location}</p>
              <p>${date + '&nbsp;' + time}</p>
              <button class="btn btn-secondary" id="viewDetailsBtn">
                <i class="icon-plus"></i>
                View Deatils
              </button>
            </div>
          </div>
        `;
        })
        .join('')}
    </div>
  </div>`
    : '';
};

export default HazardCard;
