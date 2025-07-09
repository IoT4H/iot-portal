"use client"; // Error components must be Client Components

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { useEffect } from "react";

export default function Error({
    error,
    reset
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div
            className={
                "mx-auto w-max h-full p-4 text-center leading-10 rounded border border-red-500  my-16 flex-auto bg-white dark:bg-zinc-900 shadow max-h-full sticky top-"
            }
        >
            <h2 className={"text-xl"}>Oops! Da ist etwas schief gegangen.</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={"/fixing_bugs.svg"} className={"h-32 mx-auto my-8"} />
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className={"font-bold underline decoration-orange-500 underline-offset-4"}
            >
                <ChevronRightIcon className={"h-[1em] inline text-orange-500"} /> Erneut versuchen{" "}
                <ChevronLeftIcon className={"h-[1em] inline text-orange-500"} />
            </button>
        </div>
    );
}
