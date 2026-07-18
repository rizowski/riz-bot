import { describe, expect, it } from 'vitest';
import { BLAZE_IT_RE, hesNotYour, isUrl, spongebobCase } from './lib.js';

describe('BLAZE_IT_RE', () => {
  it('matches 420 in its many forms', () => {
    expect(BLAZE_IT_RE.test('lol 420')).toBe(true);
    expect(BLAZE_IT_RE.test('4:20 somewhere')).toBe(true);
    expect(BLAZE_IT_RE.test('on 4/20')).toBe(true);
    expect(BLAZE_IT_RE.test('4.20')).toBe(true);
  });

  it('ignores unrelated numbers', () => {
    expect(BLAZE_IT_RE.test('I have 42 apples and 0 friends')).toBe(false);
  });
});

describe('hesNotYour', () => {
  it('corrects friend to buddy', () => {
    expect(hesNotYour("he's my friend")).toBe("He's not your friend, buddy");
  });

  it('corrects buddy to guy', () => {
    expect(hesNotYour('sure thing buddy')).toBe("He's not your buddy, guy");
  });

  it('prefers friend when both appear', () => {
    expect(hesNotYour('friend buddy')).toBe("He's not your friend, buddy");
  });

  it('stays quiet otherwise', () => {
    expect(hesNotYour('hello there')).toBeNull();
  });
});

describe('spongebobCase', () => {
  it('alternates casing starting lowercase', () => {
    expect(spongebobCase('this is fine')).toBe('tHiS Is fInE');
  });
});

describe('isUrl', () => {
  it('detects whole-message URLs', () => {
    expect(isUrl('https://example.com/thing')).toBe(true);
  });

  it('does not treat text containing a URL as a URL', () => {
    expect(isUrl('check this https://example.com')).toBe(false);
  });

  it('does not treat plain text as a URL', () => {
    expect(isUrl('henlo')).toBe(false);
  });
});
