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
	initCounters('.hero__counter-item h2');
});

// finctions
function openMobileNav() {
	const btn = document.querySelector<HTMLButtonElement>('.site-header .site-header__open-menu');

	if (!btn) return;

	btn.addEventListener('click', (e) => {
		e.preventDefault();
		document.body.classList.toggle('nav-open');
	});

	// close by Esc and return focus to the menu button
	document.addEventListener('keydown', (e) => {
		if (e.key !== 'Escape' || !document.body.classList.contains('nav-open')) return;

		document.body.classList.remove('nav-open');
		btn.focus();
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
		// number of items shown before "View All", set per grid via data-visible-items
		const visibleCount = Number(parentEl.dataset.visibleItems) || 3;

		if (!gridItems.length) return;

		if (gridItems.length > visibleCount) {
			let isOpened = false;
			const btnOpen = parentEl.querySelector<HTMLButtonElement | HTMLLinkElement>(
				'.btn--load-more'
			);

			if (!btnOpen) return;

			switchClass(gridItems, visibleCount, true);

			btnOpen.addEventListener('click', (e) => {
				e.preventDefault();
				const textHolder = btnOpen.querySelector<HTMLSpanElement>('.btn__text');

				if (!textHolder) return;

				isOpened = !isOpened;
				btnOpen.classList.toggle('opened', isOpened);

				if (isOpened) {
					textHolder.textContent = btnOpen.dataset.textLess ?? 'Show Less';
					switchClass(gridItems, visibleCount, false);
					return;
				}
				textHolder.textContent = btnOpen.dataset.textMore ?? 'View All';
				switchClass(gridItems, visibleCount, true);
			});
		}
	});

	function switchClass(items: NodeListOf<HTMLElement>, visibleCount: number, add: boolean) {
		items.forEach((item, i) => {
			if (i >= visibleCount) {
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

// counts the number in the element's first text node up from 0 when the element
// scrolls into view; the rest of the text ("+", "%", <small>) stays as it is
function initCounters(selector: string, duration = 1500) {
	const counters = document.querySelectorAll<HTMLElement>(selector);

	if (!counters.length) return;

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const items = [...counters].flatMap((counter) => {
		const textNode = [...counter.childNodes].find(
			(node): node is Text => node instanceof Text && /\d/.test(node.data)
		);
		const match = textNode?.data.match(/\d[\d,]*(\.\d+)?/);

		if (!textNode || !match) return [];

		const original = textNode.data;
		const [before, after] = [
			original.slice(0, match.index),
			original.slice(match.index! + match[0].length),
		];
		const target = parseFloat(match[0].replace(/,/g, ''));
		const formatter = new Intl.NumberFormat('en-US', {
			useGrouping: match[0].includes(','),
			minimumFractionDigits: match[1] ? match[1].length - 1 : 0,
			maximumFractionDigits: match[1] ? match[1].length - 1 : 0,
		});
		const render = (value: number) => {
			textNode.data = before + formatter.format(value) + after;
		};

		render(0);

		return [{ counter, original, target, render, textNode }];
	});

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;

				observer.unobserve(entry.target);

				const item = items.find(({ counter }) => counter === entry.target);

				if (!item) return;

				const start = performance.now();

				function tick(now: number) {
					const progress = Math.min((now - start) / duration, 1);
					const eased = 1 - (1 - progress) ** 3; // ease-out cubic

					if (progress < 1) {
						item!.render(item!.target * eased);
						requestAnimationFrame(tick);
					} else {
						item!.textNode.data = item!.original;
					}
				}

				requestAnimationFrame(tick);
			});
		},
		{ threshold: 0.6 }
	);

	items.forEach(({ counter }) => observer.observe(counter));
}
