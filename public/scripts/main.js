/* eslint-env browser */
const html = document.documentElement;
const navBarBurgerBtn = document.getElementById(
	'navigation-bar-burger-button',
);
const navBarContent = document.getElementById(
	'navigation-bar-content',
);
const imageModal = document.getElementById('image-modal');
const imageModalImage = document.getElementById('image-modal-image');
const imageModalAlt = document.getElementById('image-modal-alt');
const imageModalCloseBtn = document.getElementById('image-modal-close-btn');
const imageModalBackground = document.getElementById('image-modal-background');

if (navBarBurgerBtn) {
	navBarBurgerBtn.addEventListener('click', () => {
		navBarBurgerBtn.classList.toggle('is-active');
		navBarContent.classList.toggle('is-active');

		const isOpen = JSON.parse(
			navBarBurgerBtn.getAttribute('aria-expanded'),
		);
		navBarBurgerBtn.setAttribute('aria-expanded', !isOpen);
	});
}

const closeImageModal = () => {
	if (html && imageModal && imageModalCloseBtn && imageModalBackground) {
		html.classList.toggle('is-clipped');
		imageModal.classList.toggle('is-active');
		imageModalCloseBtn.removeEventListener('click', closeImageModal);
		imageModalBackground.removeEventListener('click', closeImageModal);
	}
};

const openImageModal = (image, alt) => {
	if (
		html && imageModal && imageModalImage && imageModalAlt
		&& imageModalCloseBtn && imageModalBackground
	) {
		imageModalImage.src = image;
		imageModalAlt.innerText = alt;
		html.classList.toggle('is-clipped');
		imageModal.classList.toggle('is-active');

		imageModalCloseBtn.addEventListener('click', closeImageModal);
		imageModalBackground.addEventListener('click', closeImageModal);
	}
};
