"use client"


import { PlayIcon } from "@heroicons/react/24/solid";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function SetupButton() {

    const router = useRouter();

    const pathname = usePathname();

    const [link, SetLink] = useState(`${pathname}/setup`);

    return link ? (
        <div onClick={() => router.push(link)} className={" mt-auto w-full text-center ml-auto bg-orange-500/80 hover:bg-orange-500 text-white flex-row flex gap-4 justify-center items-center uppercase mx-4 px-4 py-4"}>
            <PlayIcon className={"h-4"}/>Setup einrichten
        </div>
    ) : null;
}
