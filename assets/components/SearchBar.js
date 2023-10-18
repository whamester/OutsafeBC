const SearchBar = ({categories, reports}) => {
  const filterModalToggle = () => {
    return `
      const filterModal = document.getElementById("filter--modal");
      filterModal.classList.toggle("d-none");
    `
  }

  return `
    <div class="mt-4">
      <div class="d-flex mx-4">
        <div class="form-control">
          <input class="search--input" placeholder="Search here..."/>
        </div>
        <button 
          class="btn btn-light filter--btn"
          onclick='${ filterModalToggle() }'>
          <img src="/assets/img/icons/icon-filter.png">
          Filters
        </button>
      </div>
      <div class="ms-4 container">
        <div class="mt-2 row flex-nowrap overflow-auto">
          ${ categories?.map(item => {
            return `<button class="col-xs-4 btn btn-light btn-tags me-3">${ item?.name }</button>`
          }).join("") }
        </div>
      </div>
      <div class="position-fixed bottom-0 start-0 row flex-nowrap gap-3 overflow-auto m-4 search--results">
        ${ reports?.map(item => {
          const location = `${ item?.location?.lat }, ${ item?.location?.lng }, ${ item?.location?.address }`;
          const dateObj = new Date(item.updated_at);
          const date = dateObj.toLocaleString("default", { day: "numeric", weekday: "long", year: "numeric" });
          const time = dateObj.toLocaleTimeString("default", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" });

          return `
            <div class="col-2 bg-white p-2 rounded report--cards" data-details='${ JSON.stringify(item) }'>
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
      id="filter--modal" 
      class="position-fixed top-0 start-0 bg-light vw-100 vh-100 d-none">
      <button onclick='${ filterModalToggle() }'>X</button>
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