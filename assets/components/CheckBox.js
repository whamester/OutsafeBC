const CheckBox = (id, label) => {
  return `
    <div class="text-body-2 checkbox">
      <input
        class="cb"
        type="checkbox"
        data-id="${ id }"
        id="cb-id-${ id }" />
      <label for="cb-id-${ id }">${ label }</label>
    </div>
  `
}

export default CheckBox;
