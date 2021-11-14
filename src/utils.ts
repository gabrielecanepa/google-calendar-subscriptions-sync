import { decodeAsync } from '@msgpack/msgpack'
import { calendar_v3 } from 'google-calendar-subscriptions'

/**
 * Converts a string to an environment variable name format.
 */
export const toEnv = (string: string): string => string.toUpperCase().replace(/[^A-Z0-9]/g, '_')

/**
 * Returns the value of an environment variable or throws an error if not found.
 */
export const getEnv = (key: string, strict = false): string => {
  const envKey = toEnv(key)
  const value = process.env[envKey]
  if (strict && !value) throw Error(`Environment variable ${envKey} not found.`)
  return value
}

/**
 * Returns true if the current environment is GitHub Actions.
 */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true'

/**
 * Logs a info message to the console.
 */
export const info = (message: string): void => console.info(message)
/**
 * Logs a notice message to the console.
 */
export const notice = (message: string): void =>
  isGithubActions ? info(`::notice::${message}`) : info(`Notice: ${message}`)
/**
 * Logs a warning message to the console.
 */
export const warning = (message: string): void =>
  isGithubActions ? info(`::warning::${message}`) : console.warn(`Warning: ${message}`)
/**
 * Logs an error message to the console.
 */
export const error = (message: string): void =>
  isGithubActions ? info(`::error::${message}`) : console.error(`Error: ${message}`)

/**
 * Exits the process with an error message.
 * The process will exit with code 1 if not specified.
 */
export const exit = (message: string, code: number = 1): void => {
  error(`${message}\n`)
  process.exit(code)
}

/**
 * Fetches and decodes a MessagePack from a URL.
 */
export const fetchMsgPack = async (url: string): Promise<Record<string, any>> =>
  await decodeAsync((await fetch(url)).body)

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
 * Converts a Google Calendar event to an event ID.
 * The event ID is a base32hex representation of the event summary and start date.
 */
export const toEventId = ({ summary, start }: calendar_v3.Schema$Event): string => {
  const date = new Date(start.dateTime || start.date).toISOString().split('T')[0]
  return toBase32Hex(`${summary}${date}`)
}

/**
 * Returns true if the two dates are the same.
 */
export const isSameDate = (
  calendarDate1: calendar_v3.Schema$EventDateTime,
  calendarDate2: calendar_v3.Schema$EventDateTime
): boolean => {
  const date1 = new Date(calendarDate1.dateTime || calendarDate1.date)
  const date2 = new Date(calendarDate2.dateTime || calendarDate2.date)
  return date1.toISOString().split('T')[0] === date2.toISOString().split('T')[0]
}

/**
 * Pads the specified number with leading zeros and returns it as a string.
 */
export const addLeadingZeros = (number: number, length = 2): string => String(number).padStart(length, '0')
