"use client"


import { PlayIcon } from "@heroicons/react/24/solid";
import { AuthContext } from "@iot-portal/frontend/app/common/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function SetupButton({ slug } : { slug: string}) {

    const router = useRouter();


    const auth = useContext(AuthContext);

    const [link, SetLink] = useState<string>(`/usecase/${slug}/setup/`);
    const [isAuth, SetIsAuth] = useState<boolean>(false);


    useEffect(() => {
        SetIsAuth(auth.isAuth());
        console.log( link, slug)
    }, [slug]);

    return isAuth && link ? (
        <Link href={link}  className={" mt-auto cursor-pointer w-full text-center ml-auto bg-orange-500/80 hover:bg-orange-500 text-white flex-row flex gap-4 justify-center items-center uppercase mx-4 px-4 py-4"}>
            <PlayIcon className={"h-6"}/>Setup einrichten
        </Link>
    ) : null;
}
