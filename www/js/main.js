// URL format http://localhost/2022-09-19/04:00

document.addEventListener('DOMContentLoaded', () => {
	phInit();
});

document.addEventListener('ph-loaded', () => {
	const initialDate = new Date();

	roundToNextHour(initialDate);

	datepicker.value = toDatePickerFormat(initialDate);
});

function toDatePickerFormat(date) {
	const localDate = new Date(date.getTime());

	localDate.setMinutes(localDate.getMinutes() - date.getTimezoneOffset())

	return localDate.toISOString().replace('Z', '');
}

function roundToNextHour(date) {
	date.setMinutes(date.getMinutes() + 60);
	date.setMinutes(0, 0, 0);
}