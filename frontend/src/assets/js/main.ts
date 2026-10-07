// Font Awesome as a webfont: core styles + brand icons only (<i class="fa-brands fa-…">)
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/brands.min.css';
import '@fontsource-variable/roboto/wght.css';
import '@fontsource-variable/roboto-mono/wght.css';
import '../scss/main.scss';

import { breakpoints } from './breakpoints';

// init
document.addEventListener('DOMContentLoaded', () => {
	openMobileNav();
	setHeaderHeightVariable();
	allowMobileNavAnimation();
	initGridMobile('.trends__grid', '.trends__item');
	initGridMobile('.latest-collection__grid', '.latest-collection__item');
	initGridMobile('.testimonial__grid', '.testimonial__item');
	initGridMobile('.faq__grid', '.faq__item');
	initMarqueeLinks('.marquee-links');
});

// finctions
function openMobileNav() {
	const btn = document.querySelector<HTMLButtonElement>('.site-header .site-header__open-menu');

	if (!btn) return;

	btn.addEventListener('click', (e) => {
		e.preventDefault();
		document.body.classList.toggle('nav-open');
	});
}

function setHeaderHeightVariable() {
	const header = document.querySelector<HTMLElement>('.site-header');

	if (!header) return;

	let lastHeight = header.offsetHeight;
	document.body.style.setProperty('--header-height', `${lastHeight}px`);

	const observer = new ResizeObserver(([entry]) => {
		const height = Math.round(
			entry.borderBoxSize[0]?.blockSize ?? entry.target.getBoundingClientRect().height
		);

		if (height === lastHeight) return;

		lastHeight = height;
		document.body.style.setProperty('--header-height', `${height}px`);
	});

	observer.observe(header);
}

function allowMobileNavAnimation() {
	const siteNav = document.querySelector<HTMLElement>('.site-nav');

	if (!siteNav) return;

	const className = 'mobile-navigation-animation';
	const mediaQuery = window.matchMedia(`(max-width: ${breakpoints.lg - 1}px)`);
	let timeout: ReturnType<typeof setTimeout> | undefined;

	function handleMediaChange({ matches }: MediaQueryList | MediaQueryListEvent) {
		clearTimeout(timeout);

		if (matches) {
			timeout = setTimeout(() => document.body.classList.add(className), 50);
		} else {
			document.body.classList.remove(className);
		}
	}

	handleMediaChange(mediaQuery);
	mediaQuery.addEventListener('change', handleMediaChange);
}

function initGridMobile(parentEl: string, childEl: string) {
	const gridParent = document.querySelectorAll<HTMLElement>(parentEl);

	if (!gridParent.length) return;

	gridParent.forEach((parentEl) => {
		const gridItems = parentEl.querySelectorAll<HTMLElement>(childEl);

		if (!gridItems.length) return;

		console.log(typeof gridItems);

		if (gridItems.length > 3) {
			let isOpened = false;
			const btnOpen = parentEl.querySelector<HTMLButtonElement | HTMLLinkElement>(
				'.btn--load-more'
			);

			if (!btnOpen) return;

			switchClass(gridItems, true);

			btnOpen.addEventListener('click', (e) => {
				e.preventDefault();
				const textHolder = btnOpen.querySelector<HTMLSpanElement>('.btn__text');

				if (!textHolder) return;

				isOpened = !isOpened;
				btnOpen.classList.toggle('opened', isOpened);

				if (isOpened) {
					textHolder.textContent = btnOpen.dataset.textLess ?? 'Show Less';
					switchClass(gridItems, false);
					return;
				}
				textHolder.textContent = btnOpen.dataset.textMore ?? 'View All';
				switchClass(gridItems, true);
			});
		}
	});

	function switchClass(items: NodeListOf<HTMLElement>, add: boolean) {
		items.forEach((item, i) => {
			if (i > 2) {
				item.classList.toggle('hidden', add);
			}
		});
	}
}

function initMarqueeLinks(selector: string) {
	const marquees = document.querySelectorAll<HTMLElement>(selector);

	if (!marquees.length) return;

	marquees.forEach((marquee) => {
		const track = marquee.querySelector<HTMLElement>('.marquee-links__track');
		const baseList = track?.querySelector<HTMLElement>('.marquee-links__list');

		if (!track || !baseList) return;

		const clones: HTMLElement[] = [];

		function createClone() {
			const clone = baseList!.cloneNode(true) as HTMLElement;
			clone.setAttribute('aria-hidden', 'true');
			clone.querySelectorAll('a').forEach((link) => link.setAttribute('tabindex', '-1'));
			return clone;
		}

		function update() {
			const listWidth = baseList!.getBoundingClientRect().width;
			const viewWidth = marquee.clientWidth;

			if (!listWidth || !viewWidth) return;

			// the track moves by one list width, so it must cover the viewport
			// plus one extra list at every moment of the animation
			const clonesNeeded = Math.ceil(viewWidth / listWidth);

			while (clones.length < clonesNeeded) {
				const clone = createClone();
				clones.push(clone);
				track!.append(clone);
			}

			while (clones.length > clonesNeeded) {
				clones.pop()?.remove();
			}

			const speed =
				parseFloat(getComputedStyle(marquee).getPropertyValue('--marquee-speed')) || 50;

			marquee.style.setProperty('--marquee-shift', `${listWidth}px`);
			marquee.style.setProperty('--marquee-duration', `${Math.round(listWidth / speed)}s`);
			marquee.classList.add('is-ready');
		}

		update();

		// re-run when the viewport or the list size changes (breakpoints, web fonts)
		const observer = new ResizeObserver(update);
		observer.observe(marquee);
		observer.observe(baseList);
	});
}
