'use client' // Error components must be Client Components

import { useEffect } from 'react'

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className={"mx-auto w-max h-full p-4 text-center leading-10 rounded border border-red-500  my-16 flex-auto bg-white dark:bg-zinc-800 shadow max-h-full sticky top-"}>
            <h2 className={"text-xl"}>Something went wrong!</h2>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className={"font-bold underline-offset-2 underline decoration-orange-500"}
            >
                Try again
            </button>
        </div>
    )
}
