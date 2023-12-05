import { calendar_v3 } from 'google-calendar-subscriptions'
import { COURSE_REGEX, ROLE_REGEX, addresses, modules } from './data'
import { addLeadingZeros } from '@/utils'

export const parseEvents = (events: calendar_v3.Schema$Event[]): calendar_v3.Schema$Event[] =>
  events.map(event => {
    const { description, htmlLink, location, summary } = event

    if (location) {
      event.location = location ? addresses[location.toLowerCase()] || location : null
    }

    if (description) {
      const [roleDescription, courseDescription, ...activitiesDescription] = description.split('\n').filter(Boolean)

      const parts = []

      const course = courseDescription.replace(COURSE_REGEX, '').trim()
      if (course) parts.push(course)

      let role: string = null
      const roleLower = roleDescription.match(ROLE_REGEX)?.at(1)
      const roleUpper = roleLower ? (roleLower === 'lecturer' ? 'Lecturer' : 'TA') : null
      if (roleUpper) role = roleDescription.replace(roleLower, roleUpper)
      if (activitiesDescription.length) role += '\n' + activitiesDescription.map(d => `・${d}`).join('\n')
      if (role) parts.push(role)

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
          parts.push(`URL: ${lecturesUrl}/${lecturePaths.join('%2F')}`)
        }
      }
      event.description = parts.join('\n\n')
    }

    return event
  })
