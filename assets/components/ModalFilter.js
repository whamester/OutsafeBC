import CheckBox from "./CheckBox.js";

const ModalFilter = (categories) => {
  return `
    <div
      class="modal-filter hidden">
      <button id="closeBtnDesktop"></button>
      <div class="modal-filter--top">
        <button 
          class="modal-filter--close-btn">
          <img src="/assets/icons/close-square.svg"/>
        </button>
        <div class="modal-filter--heading-box">
          <h2 class="modal-filter--heading-txt">Filters</h2>
        </div>
      </div>
      <div class="modal-filter--wrapper-outer">
        <div class="modal-filter--wrapper-inner">
          ${ categories?.map(item => {
            return `
              <div class="modal-filter--catergories-wrapper-outer">
                <h3 class="text-body-1">${ item?.name }</h3>
                <div class="modal-filter--categories-wrapper-inner">
                  ${ 
                    item?.options?.map(option => {
                      return  CheckBox(option?.id, option?.name);
                    }).join("") 
                  }
                </div>
              </div>
            `
            }).join("") 
          }
        </div>
      </div>
      <div class="modal-filter--bottom">
        <div class="modal-filter--bottom-wrapper">
          <button
            id="clearReportsBtn"
            class="text-body-2 modal-filter--clear-btn">Clear All</button>
          <button
            disabled="true"
            id="showReportsBtn"
            class="btn btn-primary text-body-2 modal-filter--show-btn">Show reports</button>
        </div>
      </div>
    </div>
  `
}

export default ModalFilter;