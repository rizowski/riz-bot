import { describe, expect, it } from 'vitest';
import { TrackQueue } from './queue.js';

function track(id) {
  return { id, title: `track-${id}` };
}

describe('TrackQueue', () => {
  it('serves tracks in FIFO order', () => {
    const queue = new TrackQueue();
    queue.add(track('a'));
    queue.addAll([track('b'), track('c')]);

    expect(queue.next().id).toBe('a');
    expect(queue.next().id).toBe('b');
    expect(queue.next().id).toBe('c');
    expect(queue.next()).toBeNull();
  });

  it('clears the queue', () => {
    const queue = new TrackQueue();
    queue.addAll([track('a'), track('b')]);
    queue.clear();

    expect(queue.size).toBe(0);
    expect(queue.next()).toBeNull();
  });

  it('shuffle keeps the same tracks', () => {
    const queue = new TrackQueue();
    const tracks = ['a', 'b', 'c', 'd', 'e'].map(track);
    queue.addAll(tracks);
    queue.shuffle();

    const ids = queue
      .toArray()
      .map((t) => t.id)
      .toSorted();

    expect(ids).toEqual(['a', 'b', 'c', 'd', 'e']);
    expect(queue.size).toBe(5);
  });

  it('toArray returns a copy, not the internal list', () => {
    const queue = new TrackQueue();
    queue.add(track('a'));

    const copy = queue.toArray();
    copy.push(track('b'));

    expect(queue.size).toBe(1);
  });
});
