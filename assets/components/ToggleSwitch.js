const ToggleSwitch = (id) => {
	return `
	<div class="report-card__toggle_button">
		<label class="switch">
			<input type="checkbox" id="ts-${ id }" checked>
			<span class="slider round"></span>
		</label>
		<span id="toggleStatus" class="text-body-3 medium">Active</span>
	</div>
  	`
}

export const onToggle = ({ target }) => {
	const toggleSwitch = target;
	const toggleElem = toggleSwitch.closest('.report-card__toggle_button');
	const toggleStatus = toggleElem.querySelector('#toggleStatus');

	if (toggleSwitch.checked) {
		toggleStatus.textContent = 'Ongoing'
		toggleStatus.style.color = 'var(--success-success-500-base, #10973D)'
	} else {
		toggleStatus.textContent = 'Inactive'
		toggleStatus.style.color = 'var(--warning-warning-700, #AD7311)'
	}
}

export default ToggleSwitch
