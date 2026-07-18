export function sanitizeEmojiName(input) {
  return input
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^\w -]/g, '')
    .replace(/[\s-]+/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

export function isValidEmojiName(name) {
  return name.length >= 2 && name.length <= 32;
}
