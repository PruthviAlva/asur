import { useState, useEffect } from 'react'

/**
 * Delays updating the value until the user stops typing
 * Prevents an API call on every single keystroke
 *
 * @param {any} value    - The value to debounce (search input)
 * @param {number} delay - Milliseconds to wait (500ms = good UX)
 */
export default function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        // Set a timer — if value changes before it fires, it resets
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        // Cleanup: cancel the previous timer on every render
        return () => clearTimeout(timer)
    }, [value, delay])

    return debouncedValue
}