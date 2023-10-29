let div = document.createElement('div')

const ToggleSwitch = () => {
	div.setAttribute('class', 'report-card__toggle_button')
	div.innerHTML = ` <label class="switch">
            <input type="checkbox" id="toggleSwitch" checked>
            <span class="slider round"></span>
        </label>
        <span id="toggleStatus" class="text-body-3 medium">Active</span>
  `
	return div
}

export const toggle = (e) => {
    console.log(e);
	const toggleSwitch = e.target
    console.log(toggleSwitch);

	if (toggleSwitch.checked) {
		toggleStatus.textContent = 'Ongoing'
		toggleStatus.style.color = 'var(--success-success-500-base, #10973D)'
	} else {
		toggleStatus.textContent = 'Inactive'
		toggleStatus.style.color = 'var(--warning-warning-700, #AD7311)'
	}
}

export default ToggleSwitch
