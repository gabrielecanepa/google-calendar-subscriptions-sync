import { decodeAsync } from '@msgpack/msgpack'

/**
 * Returns true if the current environment is CI.
 */
const isCI = process.env.CI === 'true'

/**
 * Logs a notice message to the console.
 */
export const notice = (message: string): void => isCI ? console.info(`::notice::${message}`) : console.info(message)
/**
 * Logs a warning message to the console.
 */
export const warning = (message: string): void => isCI ? console.warn(`::warning::${message}`) : console.warn(message)
/**
 * Logs an error message to the console.
 */
export const error = (message: string): void => isCI ? console.error(`::error::${message}`) : console.error(message)

/**
 * Fetches and decodes MessagePack from a URL.
 */
export const fetchMsgPack = async (url: string): Promise<Record<string, any>> => await decodeAsync((await fetch(url)).body)

/**
 * Converts a list to a formatted title.
 */
export const titleizeList = (list: any[]): string => {
  if (list.length === 0) return ''
  if (list.length === 1) return list[0]
  const last = list.pop()
  return `${list.join(', ')} and ${last}`
}

/**
 * Converts a string to base32hex format.
 */
export const toBase32Hex = (string: string): string => string.match(/([a-v]|[0-9])/gi)?.join('').toLowerCase() || ''
