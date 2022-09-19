// URL format http://localhost/2022-09-19/04-00

document.addEventListener('DOMContentLoaded', () => {
	phInit();
});

document.addEventListener('ph-loaded', () => {
	const initialDate = new Date();

	roundToNextHour(initialDate);

	datepicker.value = toDatePickerFormat(initialDate);
	datepicker.addEventListener('change', (e) => {
		refreshEventUrl();
	});

	const eventDate = parseEventUrl(location);

	if (eventDate) {
		showEventPage(eventDate);

		return;
	}

	refreshEventUrl();
});

function showPage(page) {
	if (!page instanceof Node) {
		page = document.querySelector(page);
	}

	const currentPage = page.parentElement.querySelector('.active');
	currentPage && currentPage.classList.remove('active');

	page.classList.add('active');
}

function toDatePickerFormat(date) {
	const localDate = new Date(date.getTime());

	localDate.setMinutes(localDate.getMinutes() - date.getTimezoneOffset())

	return localDate.toISOString().replace(/\:\d{2}\.\d{3}Z$/, '');
}

function roundToNextHour(date) {
	date.setMinutes(date.getMinutes() + 60);
	date.setMinutes(0, 0, 0);
}

function refreshEventUrl() {
	const eventDate = new Date(datepicker.value);

	eventurl.value = makeEventUrl(eventDate);
}

function makeEventUrl(date) {
	const datePart = [date.getFullYear(),
		(date.getMonth()+1).toString().padStart(2, '0'),
		(date.getDate()).toString().padStart(2, 0)
	];

	const timePart = [
		(date.getHours()+1).toString().padStart(2, '0'),
		(date.getMinutes()).toString().padStart(2, '0')
	];

	return new URL(`/${datePart.join('-')}/${timePart.join('-')}`,
		location.href);
}

function parseEventUrl(url) {
	const urlRe = /^\/(?<year>\d{4})-(?<month>\d{2})-(?<date>\d{2})\/(?<hour>\d{2})-(?<minute>\d{2})$/;

	const match = url.pathname.match(urlRe);

	try {
		return match && new Date(match.groups.year, parseInt(match.groups.month)-1,
				match.groups.date,
				parseInt(match.groups.hour)-1, match.groups.minute);
	} catch {
		return null;
	}
}

function showEventPage(eventDate) {
	const localDate = new Date(eventDate);
	
	hourHand.style.transform = `rotate(${(localDate.getHours()/12)*360}deg)`;
	minuteHand.style.transform = `rotate(${(localDate.getMinutes()/60)*360}deg)`;

	showPage(eventPage);
}