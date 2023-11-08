const CheckBox = (id, label) => {
  return `
    <div class="checkbox">
      <input
        type="checkbox"
        data-id="${ id }"
        id="cb-id-${ id }" />
      <label for="cb-id-${ id }">${ label }</label>
    </div>
  `
}

export default CheckBox;
