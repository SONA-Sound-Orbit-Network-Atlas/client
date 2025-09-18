export function formatDateToYMD(input: Date | string = new Date()): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
