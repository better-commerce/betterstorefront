import { useEffect, useRef } from 'react'

const useDebounce = (callback: Function, delay: number) => {
    const timeoutRef: any = useRef(null)

    useEffect(() => {
        // Cleanup the previous timeout on re-render
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    const debouncedCallback = (...args: any) => {
        if (timeoutRef?.current) {
            clearTimeout(timeoutRef?.current)
        }

        timeoutRef.current = setTimeout(() => {
            callback(...args)
        }, delay)
    };

    return debouncedCallback
}

export default useDebounce