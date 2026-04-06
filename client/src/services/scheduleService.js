import axios from 'axios'
import { JIKAN_BASE } from '../utils/constants'

const jikan = axios.create({
    baseURL: JIKAN_BASE,
    timeout: 10000,
})

// Jikan schedule endpoint returns anime grouped by day
const scheduleService = {
    // Get full week schedule
    getFullSchedule: async () => {
        const days = [
            'monday', 'tuesday', 'wednesday',
            'thursday', 'friday', 'saturday', 'sunday'
        ]

        // Fetch all 7 days in parallel
        const results = await Promise.allSettled(
            days.map(day =>
                jikan.get(`/schedules?filter=${day}&limit=25`).then(r => r.data)
            )
        )

        // Shape into { monday: [...], tuesday: [...], ... }
        return days.reduce((acc, day, i) => {
            acc[day] = results[i].status === 'fulfilled'
                ? results[i].value.data || []
                : [] // graceful fallback if one day fails
            return acc
        }, {})
    },

    // Get schedule for a single day
    getDaySchedule: async (day) => {
        const res = await jikan.get(`/schedules?filter=${day}&limit=25`)
        return res.data
    },
}

export default scheduleService