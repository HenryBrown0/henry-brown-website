/* eslint-env browser */
const navBarBurgerBtn = document.getElementById(
	'navigation-bar-burger-button',
);
const navBarContent = document.getElementById(
	'navigation-bar-content',
);

navBarBurgerBtn.addEventListener('click', () => {
	navBarBurgerBtn.classList.toggle('is-active');
	navBarContent.classList.toggle('is-active');

	const isOpen = JSON.parse(
		navBarBurgerBtn.getAttribute('aria-expanded'),
	);
	navBarBurgerBtn.setAttribute('aria-expanded', !isOpen);
});
