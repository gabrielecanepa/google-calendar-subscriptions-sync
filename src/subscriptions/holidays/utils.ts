import { titleizeList } from '@/lib/utils'
import { calendar_v3 } from 'google-calendar-subscriptions'

export const parseSummary = ({ location, summary }: calendar_v3.Schema$Event) => {
  if (summary.includes('(Not a Public Holiday)')) return summary.replace('(Not a Public Holiday)', '').trim()
  if (!summary.includes('(Regional Holiday)')) return `🇮🇹 ${summary.trim()}`
  const cities = titleizeList(location.split(', '))
  return `🏴󠁧󠁢󠁥󠁮󠁧󠁿 ${summary.replace('(Regional Holiday)', `(${cities})`)}`
}
