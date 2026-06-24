export function toTitleCase(text?: string): string {
  return text
    ? text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
    : '';
}
