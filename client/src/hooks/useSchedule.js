import { useQuery } from '@tanstack/react-query'
import scheduleService from '../services/scheduleService'

export function useFullSchedule() {
    return useQuery({
        queryKey: ['schedule-full'],
        queryFn: scheduleService.getFullSchedule,
        staleTime: 1000 * 60 * 30, // 30 min — schedule doesn't change often
        gcTime: 1000 * 60 * 60, // 1 hour cache
    })
}

export function useDaySchedule(day) {
    return useQuery({
        queryKey: ['schedule', day],
        queryFn: () => scheduleService.getDaySchedule(day),
        enabled: !!day,
        staleTime: 1000 * 60 * 30,
    })
}