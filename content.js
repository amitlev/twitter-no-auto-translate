// Clicks "Show original" on every tweet that Twitter/X auto-translated.
// If your UI language isn't covered, add the exact button text to PHRASES.
const PHRASES = [
  'show original',
  'view original',
  'show original post',
  'הצג מקור',
  'הצג את המקור',
  'הצג מקורי',
  'הצג את הציוץ המקורי',
  'הצג את הפוסט המקורי',
];

const DONE_ATTR = 'data-no-autotranslate';

const norm = (s) => s.replace(/\s+/g, ' ').trim().toLowerCase();

function revertTranslations() {
  for (const article of document.querySelectorAll(`article:not([${DONE_ATTR}])`)) {
    // Only the tiny leaf-ish elements: the "Show original" control has short text.
    for (const el of article.querySelectorAll('[role="button"], a, button, span')) {
      const text = norm(el.textContent || '');
      if (!text || text.length > 40 || !PHRASES.includes(text)) continue;
      // Mark first so a later manual "Translate post" click isn't undone again.
      article.setAttribute(DONE_ATTR, '1');
      (el.closest('[role="button"], a, button') || el).click();
      break;
    }
  }
}

let queued = false;
new MutationObserver(() => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    revertTranslations();
  });
}).observe(document.body, { childList: true, subtree: true });

revertTranslations();
