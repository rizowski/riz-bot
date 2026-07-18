import { describe, expect, it } from 'vitest';
import { classify } from './classify.js';

describe('classify', () => {
  it('treats plain text as a search', () => {
    expect(classify('never gonna give you up')).toEqual({
      type: 'search',
      target: 'ytsearch1:never gonna give you up',
    });
  });

  it('treats a watch URL as a single video', () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

    expect(classify(url)).toEqual({ type: 'video', target: url });
  });

  it('treats a URL with a list param as a playlist', () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PL1234567890';

    expect(classify(url)).toEqual({ type: 'playlist', target: url });
  });

  it('treats a playlist URL as a playlist', () => {
    const url = 'https://www.youtube.com/playlist?list=PL1234567890';

    expect(classify(url)).toEqual({ type: 'playlist', target: url });
  });

  it('treats short youtu.be links as videos', () => {
    const url = 'https://youtu.be/dQw4w9WgXcQ';

    expect(classify(url)).toEqual({ type: 'video', target: url });
  });
});
