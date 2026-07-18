export class TrackQueue {
  #items = [];

  add(track) {
    this.#items.push(track);
  }

  addAll(tracks) {
    this.#items.push(...tracks);
  }

  next() {
    return this.#items.shift() ?? null;
  }

  clear() {
    this.#items.length = 0;
  }

  shuffle() {
    for (let i = this.#items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.#items[i], this.#items[j]] = [this.#items[j], this.#items[i]];
    }
  }

  get size() {
    return this.#items.length;
  }

  toArray() {
    return [...this.#items];
  }
}
