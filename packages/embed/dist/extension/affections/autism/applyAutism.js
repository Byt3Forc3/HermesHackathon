import { getPlatform } from "../../lib/hermes/platform.js";

export function apply() {
	console.log("Autism module activated: applying color-reduction styles");
	const styleId = "autism-color-reduction-style";


		// Do not inject CSS dynamically here — the rules live in styles.css.
		function enableHideExtras() {
			document.documentElement.classList.add('autism-hide-extras');
		}

		function disableHideExtras() {
			document.documentElement.classList.remove('autism-hide-extras');
		}

		function toggleHideExtras() {
			document.documentElement.classList.toggle('autism-hide-extras');
		}

		function enableVerticalLayout() {
			document.documentElement.classList.add('autism-vertical-layout');
		}

		function disableVerticalLayout() {
			document.documentElement.classList.remove('autism-vertical-layout');
		}

		function toggleVerticalLayout() {
			document.documentElement.classList.toggle('autism-vertical-layout');
		}

		// Paragraph summarization: generate a short, spaced summary for each paragraph
		// and overlay it on top of the paragraph. This feature is opt-in and exposed
		// via the `window.__autismAccessibility` API.

		function _splitSentences(text) {
			if (!text) return [];
			// crude sentence splitter: keep punctuation with sentences
			const m = text.match(/[^.!?\n]+[.!?\n]*/g);
			if (!m) return [text.trim()];
			return m.map(s => s.trim()).filter(Boolean);
		}

		function _firstWords(text, count) {
			return text.split(/\s+/).slice(0, count).join(' ').trim();
		}

		function createSummaryForText(text) {
			const sentences = _splitSentences(text);
			if (sentences.length > 0) {
				const first = sentences[0];
				if (first.length >= 40 || sentences.length === 1) {
					return first.length > 220 ? _firstWords(first, 30) + '…' : first;
				}
				// otherwise, combine first two sentences if short
				if (sentences.length > 1) {
					const combined = (sentences[0] + ' ' + sentences[1]).trim();
					return combined.length > 220 ? _firstWords(combined, 30) + '…' : combined;
				}
			}
			// fallback: first ~25 words
			return _firstWords(text, 25) + (text.split(/\s+/).length > 25 ? '…' : '');
		}

		function createParagraphSummaries() {
			const containerSelector = 'main, article, #content, .article';
			let paragraphs = [];
			const containers = document.querySelectorAll(containerSelector);
			if (containers && containers.length) {
				containers.forEach(c => paragraphs.push(...Array.from(c.querySelectorAll('p'))));
			} else {
				paragraphs = Array.from(document.querySelectorAll('p')).slice(0, 200);
			}

			paragraphs.forEach(p => {
				if (!(p instanceof HTMLElement)) return;
				if (p.closest && p.closest('header, footer, nav, aside, form')) return;
				const text = (p.textContent || '').trim();
				if (!text || text.length < 40) return; // skip short lines

				// attach a paragraph-level click handler (once) so users can re-open summaries
				if (!p.dataset.autismSummaryHandler) {
					p.dataset.autismSummaryHandler = '1';
					p.addEventListener('click', function (ev) {
						// Only recreate when summaries are enabled for the page
						if (!document.documentElement.classList.contains('autism-paragraph-summaries-enabled')) return;
						if (p.dataset.autismSummary === '1') return; // already showing
						// avoid recreating when clicking interactive children
						if (ev && ev.target && ev.target !== p) return;
						const summaryText = createSummaryForText(text);
						if (!summaryText) return;
						createBoxForParagraph(p, summaryText);
					});
				}

				if (p.dataset.autismSummary === '1') return;
				const summaryText = createSummaryForText(text);
				if (!summaryText) return;
				createBoxForParagraph(p, summaryText);
			});
		}

		function createBoxForParagraph(p, summaryText) {
			// ensure the paragraph is a positioning context
			const prevPosition = p.style.position || '';
			if (getComputedStyle(p).position === 'static') {
				p.style.position = 'relative';
				p.dataset.autismOriginalPosition = prevPosition;
			}

			const box = document.createElement('div');
			box.className = 'autism-paragraph-summary-box';
			box.setAttribute('role', 'note');
			box.setAttribute('tabindex', '0');
			box.setAttribute('title', 'Click or press Enter to reveal full paragraph');
			box.textContent = summaryText;

			// Allow users to dismiss the summary box to reveal the paragraph
			box.addEventListener('click', function (ev) {
				if (ev && ev.stopPropagation) ev.stopPropagation();
				try {
					box.remove();
					if (p.dataset.autismOriginalPosition !== undefined) {
						p.style.position = p.dataset.autismOriginalPosition || '';
						delete p.dataset.autismOriginalPosition;
					}
					delete p.dataset.autismSummary;
				} catch (e) {
					// ignore
				}
			});

			// keyboard accessibility: Enter or Space to dismiss
			box.addEventListener('keydown', function (ev) {
				if (ev.key === 'Enter' || ev.key === ' ') {
					ev.preventDefault();
					this.click();
				}
			});

			// mark as generated
			p.dataset.autismSummary = '1';
			p.insertBefore(box, p.firstChild);
		}

		function removeParagraphSummaries() {
			const boxes = Array.from(document.querySelectorAll('.autism-paragraph-summary-box'));
			boxes.forEach(box => {
				const p = box.closest('p');
				if (!p) { box.remove(); return; }
				box.remove();
				if (p.dataset.autismOriginalPosition !== undefined) {
					p.style.position = p.dataset.autismOriginalPosition || '';
					delete p.dataset.autismOriginalPosition;
				}
				delete p.dataset.autismSummary;
			});
		}

		function enableParagraphSummaries() {
			document.documentElement.classList.add('autism-paragraph-summaries-enabled');
			createParagraphSummaries();
		}

		function disableParagraphSummaries() {
			document.documentElement.classList.remove('autism-paragraph-summaries-enabled');
			removeParagraphSummaries();
		}

		function toggleParagraphSummaries() {
			if (document.documentElement.classList.contains('autism-paragraph-summaries-enabled')) disableParagraphSummaries(); else enableParagraphSummaries();
		}

	function enable() {
		if (document.getElementById(styleId)) return;

		const link = document.createElement('link');
		link.id = styleId;
		link.rel = 'stylesheet';
		link.href = getPlatform().resolveAsset('affections/autism/styles.css');
		document.head.appendChild(link);
		document.documentElement.classList.add('autism-color-reduced');
		// Apply hide-extras and vertical layout by default
		enableHideExtras();
		enableVerticalLayout();
		// Enable paragraph summaries by default for autism mode (opt-out via API).
		enableParagraphSummaries();
	}

	function disable() {
		const style = document.getElementById(styleId);
		if (style) style.remove();
		document.documentElement.classList.remove("autism-color-reduced");
		// Revert extras/layout when disabling
		disableHideExtras();
		disableVerticalLayout();
		// Disable paragraph summaries when autism mode is turned off
		disableParagraphSummaries();
	}

	function toggle() {
		if (document.getElementById(styleId)) disable(); else enable();
	}

	// Expose a small API on window so popup or other scripts can toggle the effect
	try {
		window.__autismAccessibility = window.__autismAccessibility || {};
		window.__autismAccessibility.enable = enable;
		window.__autismAccessibility.disable = disable;
		window.__autismAccessibility.toggle = toggle;
		window.__autismAccessibility.enabled = () => !!document.getElementById(styleId);

		// expose hide-extras and vertical layout controls
		window.__autismAccessibility.enableHideExtras = enableHideExtras;
		window.__autismAccessibility.disableHideExtras = disableHideExtras;
		window.__autismAccessibility.toggleHideExtras = toggleHideExtras;
		window.__autismAccessibility.hideExtrasEnabled = () => document.documentElement.classList.contains('autism-hide-extras');

		window.__autismAccessibility.enableVerticalLayout = enableVerticalLayout;
		window.__autismAccessibility.disableVerticalLayout = disableVerticalLayout;
		window.__autismAccessibility.toggleVerticalLayout = toggleVerticalLayout;
		window.__autismAccessibility.verticalLayoutEnabled = () => document.documentElement.classList.contains('autism-vertical-layout');

		// Paragraph summaries API
		window.__autismAccessibility.enableParagraphSummaries = enableParagraphSummaries;
		window.__autismAccessibility.disableParagraphSummaries = disableParagraphSummaries;
		window.__autismAccessibility.toggleParagraphSummaries = toggleParagraphSummaries;
		window.__autismAccessibility.paragraphSummariesEnabled = () => document.documentElement.classList.contains('autism-paragraph-summaries-enabled');
	} catch (e) {
		// ignore if pages forbid assigning to window
	}

	// Enable by default when module is applied
	enable();
}




