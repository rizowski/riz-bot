export function createRandRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createRandMax(max: number): number {
  return Math.floor(Math.random() * Math.floor(max));
}

export function percentage(): number {
  return Math.random() * 100;
}
