const CheckBox = (id, label) => {
  return `
    <div class="checkbox">
      <input
        type="checkbox"
        data-checkbox-for="${ id }"
        id="checkbox-for-${ id }" />
      <label>${ label }</label>
    </div>
  `
}

export default CheckBox;
