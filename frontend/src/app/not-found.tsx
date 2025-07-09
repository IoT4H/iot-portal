"use client"; // Error components must be Client Components

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
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
                "mx-auto w-max h-full p-4 text-center leading-10 rounded my-16 flex-auto shadow max-h-full sticky top-"
            }
        >
            <h2 className={"text-xl"}>Oops! Diese Seite konnte nicht gefunden werden.</h2>
            <img src={"/undraw_landscape_photographer_blv1.svg"} className={"h-32 mx-auto my-8"} />
            <Link
                prefetch={true}
                href={"/"}
                className={"font-bold underline decoration-orange-500 underline-offset-4"}
            >
                <ChevronRightIcon className={"h-[1em] inline text-orange-500"} /> Zurück zur
                Startseite <ChevronLeftIcon className={"h-[1em] inline text-orange-500"} />
            </Link>
        </div>
    );
}
