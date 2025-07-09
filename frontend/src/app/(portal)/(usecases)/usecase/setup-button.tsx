"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { BeakerIcon } from "@heroicons/react/24/solid";
import { AuthContext } from "@iot-portal/frontend/app/common/AuthContext";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function SetupButton({ slug }: { slug: string }) {
    const [link, SetLink] = useState<string>(`/usecase/${slug}/setup/`);
    const user = useContext(AuthContext);

    const [isAuth, SetIsAuth] = useState<boolean>(false);

    useEffect(() => {
        SetIsAuth(user !== undefined);
    }, [user]);

    return link ? (
        <Link
            href={link}
            className={` mt-4 cursor-pointer w-full text-center ml-auto bg-orange-500/80  text-white flex-row flex gap-4 justify-center items-center uppercase mx-4 px-4 py-4 ${user == undefined ? "bg-gray-500" : "hover:bg-orange-500"}`}
        >
            <BeakerIcon className={"h-6"} />
            Anwendungsfall ausprobieren
        </Link>
    ) : null;
}

export function SetupButtonReplacement() {
    return (
        <div
            className={` mt-4 cursor-not-allowed w-full text-center ml-auto border-orange-500 bg-transparent border-2 text-black dark:text-white flex-row flex gap-4 justify-center items-center uppercase mx-4 px-4 py-4`}
        >
            <ExclamationTriangleIcon className={"h-6 text-orange-500"} />
            Zur Zeit nicht verfügbar
        </div>
    );
}
