export function formatMoney(amountCents) {
  const sign = amountCents >= 0 ? '' : '-';
  const normalizedAmount = Math.abs(amountCents) / 100;

  return `${sign}$${normalizedAmount.toFixed(2)}`;
}
