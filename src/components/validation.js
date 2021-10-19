function validate() {
	const nameInput = document.querySelector('.quiz__form-input.name');
	const emailInput = document.querySelector('.quiz__form-input.email');
	const selectInput = document.querySelector('.select-input');

	if (nameInput.value.trim() !== '' && emailInput.value.trim() !== '') {
		let data;
		let gender = selectInput.getAttribute('data-value')
			? selectInput.getAttribute('data-value')
			: 'Your gender not Available';
		data = {
			name: nameInput.value,
			email: emailInput.value,
			gender,
		};

		return data;
	}

	return false;
}

export { validate };
