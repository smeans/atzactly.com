// URL format http://localhost/2022-09-19/04-00

const defaultDateOptions = {year: 'numeric', month: 'long', day: 'numeric'};

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

	copyButton.addEventListener('click', (e) => {
		const button = e.target;

		navigator.clipboard.writeText(eventurl.innerText)
			.then(() => {
				window['copyConfirmation'] && copyConfirmation.parentElement.removeChild(copyConfirmation);

				document.body.appendChild(copyConfirmationDiv.content.cloneNode(true));

				setTimeout(() => {
					const buttonRect = button.getBoundingClientRect();
					const confRect = copyConfirmation.getBoundingClientRect();


					copyConfirmation.style.top = `${buttonRect.y - confRect.width/2}px`;
					copyConfirmation.style.left = `${buttonRect.x + buttonRect.width/2 - confRect.width/2}px`;

					setTimeout(() => {
						copyConfirmation.classList.remove('active');
					}, 1);
				}, 1);
			});
	});

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
		(date.getUTCMonth()+1).toString().padStart(2, '0'),
		(date.getUTCDate()).toString().padStart(2, 0)
	];

	const timePart = [
		(date.getUTCHours()+1).toString().padStart(2, '0'),
		(date.getUTCMinutes()).toString().padStart(2, '0')
	];

	return new URL(`/${datePart.join('-')}/${timePart.join('-')}`,
		location.href);
}

function parseEventUrl(url) {
	const urlRe = /^\/(?<year>\d{4})-(?<month>\d{2})-(?<date>\d{2})\/(?<hour>\d{2})-(?<minute>\d{2})$/;

	const match = url.pathname.match(urlRe);

	try {
		return match && new Date(Date.UTC(match.groups.year, parseInt(match.groups.month)-1,
				match.groups.date,
				parseInt(match.groups.hour)-1, match.groups.minute));
	} catch {
		return null;
	}
}

function showEventPage(eventDate) {
	const localDate = new Date(eventDate);
	
	mainClock.hours = localDate.getHours();
	mainClock.minutes = localDate.getMinutes();

	mainDate.innerText = localDate.toLocaleDateString(undefined, defaultDateOptions);

	showPage(eventPage);
}