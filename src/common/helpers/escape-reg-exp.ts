/**
 * Экранирует спецсимволы в строке (которые используются в регулярных выражениях)
 */
export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
