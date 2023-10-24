export const SearchBarSuggestionCard = ({ properties }) => {
  return `
    <div 
      class="card--suggestions" 
      data-value='${ JSON.stringify({ lat: properties.lat , lng: properties.lon }) }'>
      ${ properties?.address_line1 }, ${ properties?.address_line2 }
    </div>
  `
};

const SearchBar = ({ categories, reports }) => {
  return `
    <div class="mt-4">
      <div id="box--search" class="d-flex mx-4 flex-column">
        <div class="d-flex">
          <div class="form-control">
            <input
              id="input--search"
              placeholder="Search here..."/>
          </div>
          <button 
            id="button--filter-open"
            class="btn btn-light">
            <img src="/assets/img/icons/icon-filter.png">
            Filters
          </button>
        </div>

        <div id="box--suggestion"></div>
      </div>
      <div class="ms-4 container">
        <div class="mt-2 row flex-nowrap overflow-auto">
          ${ categories?.map(item => {
            return `<button class="col-xs-4 btn btn-light btn-tags me-3">${ item?.name }</button>`
          }).join("") }
        </div>
      </div>
      <div id="cards--box" class="position-fixed bottom-0 start-0 row flex-nowrap gap-3 overflow-auto m-4 pe-5 search--results">
        ${ reports?.map((item, idx) => {
          const location = item?.location?.address ?? `${ item?.location?.lat }, ${ item?.location?.lng }`;
          const dateObj = new Date(item.updated_at);
          const date = dateObj.toLocaleString("default", { day: "numeric", weekday: "long", year: "numeric" });
          const time = dateObj.toLocaleTimeString("default", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" });

          return `
            <div id="card-${ idx+1 }" class="col-3 bg-white p-2 rounded report--cards" data-details='${ JSON.stringify(item) }'>
              <p class="h3">${ item.hazardCategory?.name }</p>
              <p>${ location }</p>
              <p>${ date + "&nbsp;" + time }</p>
            </div>
          `
          }).join("") 
        }
      </div>
    </div>

    <div 
      id="modal--filter"
      style="display: none"
      class="position-fixed top-0 start-0 bg-light vw-100 vh-100">
      <button id="button--filter-close">X</button>
      <div>
        ${ categories?.map(item => {
          return `
            <h2>${ item?.name }</h2>
            ${ 
              item?.options?.map(option => {
                return `
                  <input
                    type="checkbox"
                    data-filter-for="${ option?.name?.toLowerCase() }"
                    class="filter-cb-${ option?.name?.toLowerCase() }" />
                  ${ option?.name }
                `
              }).join("") 
            }
          `
          }).join("") 
        }
      </div>
    </div>
  `
}

export default SearchBar;