export const SearchBarSuggestionCard = ({ properties }) => {
  return `
    <div
      class="sb-sugguestion--item" 
      data-value='${ JSON.stringify({ lat: properties?.lat , lng: properties?.lon }) }'>
      ${ properties?.address_line1 }, ${ properties?.address_line2 }
    </div>
  `
};

const SearchBar = ({ categories }) => {
  return `
    <div class="sb">
      <div class="sb-search">
        <div class="d-flex">
          <div class="sb-search-box">
            <input
              class="sb-search-box--input"
              placeholder="Search location"/>
          </div>
          <button 
            class="sb-search-box--filter">
            <img src="/assets/icons/filters.svg">
            Filters
          </button>
        </div>

        <div class="sb-sugguestion"></div>
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