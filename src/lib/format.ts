/**
 * Bangladesh E-Commerce currency utilities.
 * All monetary amounts are stored in the database as integer poisha (BigInt).
 * 1 BDT = 100 Poisha.
 */

export function poishaToBDT(poisha: bigint | number | string): number {
  const val = typeof poisha === "bigint" ? Number(poisha) : Number(poisha);
  return val / 100;
}

export function bdtToPoisha(bdt: number): bigint {
  // Round to nearest integer to avoid floating point inaccuracies
  return BigInt(Math.round(bdt * 100));
}

export function formatPrice(poisha: bigint | number | string | null | undefined): string {
  if (poisha === null || poisha === undefined) return "৳0";
  const amount = poishaToBDT(poisha);
  return `৳${amount.toLocaleString("en-BD", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatBengaliPrice(poisha: bigint | number | string | null | undefined): string {
  if (poisha === null || poisha === undefined) return "৳০";
  const amount = poishaToBDT(poisha);
  const formatted = amount.toLocaleString("en-BD", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  const bengaliNumerals: Record<string, string> = {
    "0": "০",
    "1": "১",
    "2": "২",
    "3": "৩",
    "4": "৪",
    "5": "৫",
    "6": "৬",
    "7": "৭",
    "8": "৮",
    "9": "৯",
  };

  const bengaliFormatted = formatted.replace(/[0-9]/g, (digit) => bengaliNumerals[digit] || digit);
  return `৳${bengaliFormatted}`;
}
