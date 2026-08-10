export function encodeGrid(values: number[]): string {
  return values.join("");
}

export function decodeGrid(hash: string): number[] | null {
  const cleaned = hash.replace(/#/g, "").replace(/[^0-9]/g, "");
  if (cleaned.length !== 81) return null;
  const nums = [...cleaned].map(Number);
  if (nums.some((n) => n < 0 || n > 9)) return null;
  return nums;
}
