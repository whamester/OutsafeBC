const HazardFilter = (categories) => {
  return `
  <div
    style="display:none"
    class="modal-filter">
    <button 
      class="modal-filter--close">X</button>
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
  `
}

export default HazardFilter;