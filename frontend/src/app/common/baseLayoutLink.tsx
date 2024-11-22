"use client"

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { getStrapiURL, getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import * as React from "react";

export const BaseLayoutLink = (link: any) => {


    const pathname = usePathname();

    const active = useMemo(() => {
        if(typeof window !== 'undefined') {
            console.log(location.pathname, link.href)
            return pathname.startsWith(link.href);
        } else {
            console.log(typeof window)
            return false;
        }
    }, [link.href, pathname]);

    const samePage = useMemo(() => {
        try {
            return (new URL(link.href)).host === getStrapiURLForFrontend();
        } catch (e) {
            return true;
        }
    }, [link.href])

    return (
        <Link key={link.title} href={!link.deactived() ? link.href : "#"}
              className={`rounded flex items-center gap-2 px-4 py-2 ${link.deactived() ? 'text-gray-500 cursor-default' : `cursor-pointer hover:bg-orange-500 hover:dark:bg-orange-500 ${active ? 'bg-orange-500/30' : ''} hover:text-white`}`}>{link.title}
            {!samePage && <ArrowTopRightOnSquareIcon className={"h-[1em] inline"}/>}
        </Link>
    )

}
