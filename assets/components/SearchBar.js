export const SearchBarSuggestionCard = ({ properties }) => {
  return `
    <div
      class="sb-suggestion-item"
        data-addr1='${ properties?.address_line1 }'
        data-latlng='${ JSON.stringify({ lat: properties?.lat , lng: properties?.lon }) }'>
        <div class="sb-suggestion-item-wrapper">
          <img 
            class="sb-suggestion-icon"
            src="/assets/icons/location-pin-outline.svg"/>
          <div class="sb-suggestion-txt--box">
            <p class="sb-suggestion-txt--addr1">${ properties?.address_line1 }</p>
            <p class="sb-suggestion-txt--addr2">${ properties?.address_line2 }</p>
          </div>
        </div>
    </div>
  `
};

const SearchBar = ({ categories }) => {
  return `
    <div class="sb">
      <div class="sb-search">
        <div class="d-flex">
          <div class="sb-search-box">
            <img
              class="sb-search-box--icon" 
              src="/assets/icons/search.svg"/>
            <input
              class="sb-search-box--input"
              placeholder="Search location"/>
          </div>
          <button 
            class="sb-search-box--filter-btn">
            <img src="/assets/icons/filters.svg"/>
          </button>
        </div>

        <div class="sb-suggestion">
          <div class="sb-suggestion-wrapper" style="display: none"></div>
        </div>
      </div>

      <div class="sb-categories">
        <div class="sb-categories-wrapper">
          ${ categories?.map(item => {
            return `<button class="sb-categories-btn">${ item?.name }</button>`
          }).join("") }
        </div>
      </div>
    </div>

    <div id="hazard-comp"></div>
    <button
      onclick="window.location='/pages/report-hazard'"
      class="btn btn-primary btn-report-hazard">
      Report Hazard
      <span class="btn__icon">
        <i class="icon-arrow-right"></i>
      </span>
    </button>
  </div>
  `
}

export default SearchBar;