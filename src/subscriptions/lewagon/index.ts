import { calendar_v3 } from 'google-calendar-subscriptions'
import { ROLE_REGEX, addresses, modules } from './data'
import { addLeadingZeros, titleizeList, toEventId } from '@/utils'

export default events =>
  events.map(event => {
    const { description, htmlLink, location, summary } = event

    event.id = toEventId(event)
    event.summary = `Le Wagon ${summary}`

    if (location) {
      event.location = location ? addresses[location.toLowerCase()] || location : null
    }

    if (description) {
      const parts = []

      const [role, course, ...activities] = description.split('\n').filter(Boolean)

      // Course
      parts.push(course)

      // Role
      switch (role.match(ROLE_REGEX)?.at(1)) {
        case 'lecturer':
          parts.push('\n\n', 'Role: Lecturer')
          break
        case 'lead_ta':
          parts.push('\n\n', 'Role: Lead TA')
          break
        case 'ta':
          parts.push('\n\n', 'Role: TA')
          break
      }

      // Activities
      if (activities.length) {
        parts.push('\n', `Activities: ${titleizeList(activities)}`)
      }

      // URL
      if (htmlLink) {
        const lecturesUrl = htmlLink.replace(/calendar$/, 'lectures')
        const lectureName = summary.split(' - ').pop()
        const lecturePaths = []

        const module = modules.find(({ days }) => !!days.find(({ name }) => lectureName === name))

        if (module) {
          const moduleIndex = modules.indexOf(module)
          lecturePaths.push(`${addLeadingZeros(moduleIndex)}-${module.path}`)
          const day = module.days.find(({ name }) => lectureName === name)
          if (day) {
            const dayIndex = module.days.indexOf(day)
            lecturePaths.push(`${addLeadingZeros(dayIndex + 1)}-${day.path}`)
          }
          parts.push('\n\n', `URL: ${lecturesUrl}/${lecturePaths.join('%2F')}`)
        }
      }

      event.description = parts.join('')
    }

    return event
  }) as calendar_v3.Schema$Subscription['fn']
