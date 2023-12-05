import { decodeAsync } from '@msgpack/msgpack'

/**
 * Returns true if the current environment is GitHub Actions.
 */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true'

/**
 * Logs a notice message to the console.
 */
export const notice = (message: string): void => (isGithubActions ? console.info(`::notice::${message}`) : console.info(message))
/**
 * Logs a warning message to the console.
 */
export const warning = (message: string): void => (isGithubActions ? console.info(`::warning::${message}`) : console.warn(message))
/**
 * Logs an error message to the console.
 */
export const error = (message: string): void => (isGithubActions ? console.info(`::error::${message}`) : console.error(message))

/**
 * Fetches and decodes a MessagePack from a URL.
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
export const toBase32Hex = (string: string): string =>
  string
    .match(/([a-v]|[0-9])/gi)
    ?.join('')
    .toLowerCase() || ''

/**
 * Returns true if the two dates are the same.
 */
export const isSameDate = (date1: string, date2: string): boolean => new Date(date1).getTime() === new Date(date2).getTime()

/**
 * Pads the specified number with leading zeros and returns it as a string.
 */
export const addLeadingZeros = (number: number, length = 2): string => String(number).padStart(length, '0')
