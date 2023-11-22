import QuickFilter from './QuickFilter.js';

export const SearchBarSuggestionCard = ({ properties }) => {
  return `
    <div
      class="sb-suggestion-item"
        data-addr1='${properties?.address_line1}'
        data-latlng='${JSON.stringify({
          lat: properties?.lat,
          lng: properties?.lon,
        })}'>
        <div class="sb-suggestion-item-wrapper">
          <i class="icon-location-pin-outline sb-suggestion-icon"></i>
          <div class="sb-suggestion-txt--box">
            <p class="sb-suggestion-txt--addr1">${properties?.address_line1}</p>
            <p class="sb-suggestion-txt--addr2">${properties?.address_line2}</p>
          </div>
        </div>
    </div>
  `;
};

const SearchBar = ({ categories }) => {
  return `
    <div class="sb">
      <div class="sb-wrapper-outer">
        <div class="sb-wrapper-inner">
          <div class="sb-search">
            <div class="d-flex">
              <div class="sb-search-box">
                <i class="icon-search sb-search-box--icon"></i>
                <input
                  id="searchInput"
                  class="sb-search-box--input"
                  placeholder="Search location"/>
              </div>
              <button
                id="filterBtn"
                class="sb-search-box--filter-btn">
                <i class="icon-filters sb-search-box--filter-btn--icon"></i>
              </button>
            </div>
          
            <div class="sb-suggestion">
              <div class="sb-suggestion-wrapper" style="display:none"></div>
            </div>
          </div>
          
          <div class="sb-categories">
            <div class="sb-categories-wrapper">
            ${categories.length ? categories
              ?.map((item) => {
                return QuickFilter({
                  id: item.id,
                  name: item.name,
                  icon: item?.ui_settings?.icon ?? 'icon-location-pin-outline',
                });
              })
              .join('') : ''}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="hazard-comp"></div>
    <div class="report-hazard-box">
      <div class="report-hazard-box-wrapper">
        <button
          id="reportHazardBtn"
          class="btn btn-primary btn-report-hazard">
          Report Hazard
          <span class="btn__icon">
            <i class="icon-arrow-right"></i>
          </span>
        </button>
      </div>
    </div>
  </div>
  `;
};

export default SearchBar;
