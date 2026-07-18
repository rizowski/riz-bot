export function classify(input) {
  const trimmed = input.trim();

  if (!/^https?:\/\//i.test(trimmed)) {
    return { type: 'search', target: `ytsearch1:${trimmed}` };
  }

  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return { type: 'search', target: `ytsearch1:${trimmed}` };
  }

  if (url.searchParams.has('list')) {
    return { type: 'playlist', target: trimmed };
  }

  return { type: 'video', target: trimmed };
}
