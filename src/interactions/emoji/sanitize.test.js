import { describe, expect, it } from 'vitest';
import { isValidEmojiName, sanitizeEmojiName } from './sanitize.js';

describe('sanitizeEmojiName', () => {
  it('snake_cases spaces and hyphens', () => {
    expect(sanitizeEmojiName('My Cool Emoji')).toBe('my_cool_emoji');
    expect(sanitizeEmojiName('emoji-name')).toBe('emoji_name');
  });

  it('splits camelCase words', () => {
    expect(sanitizeEmojiName('partyBlob')).toBe('party_blob');
  });

  it('strips characters Discord does not allow', () => {
    expect(sanitizeEmojiName('wow!! such émoji')).toBe('wow_such_moji');
  });

  it('collapses repeated separators and trims edges', () => {
    expect(sanitizeEmojiName('  --so__much   space--  ')).toBe('so_much_space');
  });
});

describe('isValidEmojiName', () => {
  it('rejects names shorter than 2 characters', () => {
    expect(isValidEmojiName('a')).toBe(false);
  });

  it('accepts names between 2 and 32 characters', () => {
    expect(isValidEmojiName('ab')).toBe(true);
    expect(isValidEmojiName('a'.repeat(32))).toBe(true);
  });

  it('rejects names longer than 32 characters', () => {
    expect(isValidEmojiName('a'.repeat(33))).toBe(false);
  });
});
