export const BLAZE_IT_RE = /4[./:]?20/;

export const MUFASA_URL = 'https://www.youtube.com/watch?v=1AnG04qnLqI';

export const DOG_TRIGGERS = ['bark', 'bork', 'woof', '🐶'];

// Ordered: "friend" wins over "buddy" when both appear.
const HES_NOT_YOUR = [
  ['friend', 'buddy'],
  ['buddy', 'guy'],
];

// Expects already-lowercased content.
export function hesNotYour(lower) {
  const match = HES_NOT_YOUR.find(([trigger]) => lower.includes(trigger));

  if (!match) {
    return null;
  }

  const [trigger, retort] = match;

  return `He's not your ${trigger}, ${retort}`;
}

export function spongebobCase(content) {
  return [...content].map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join('');
}

// The Rust bot ignored any message whose entire content parses as a URL.
export function isUrl(content) {
  return URL.canParse(content);
}
