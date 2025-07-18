"use client";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";

export const BaseLayoutLink = ({
    href,
    title,
    deactivated
}: {
    href: string;
    title: string;
    deactivated: Function;
}) => {
    const pathname = usePathname();

    const [active, SetActive] = useState<boolean>(false);
    const [samePage, SetSamePage] = useState<boolean>(true);

    useEffect(() => {
        if (typeof window !== "undefined") {

          SetActive(pathname.startsWith(href));
        } else {

          SetActive(false);
        }
    }, [href, pathname]);

    useEffect(() => {
        try {
            SetSamePage(new URL(href).host === getStrapiURLForFrontend());
        } catch (e) {
            SetSamePage(true);
        }
    }, [href]);


  return (
        <Link
            key={title}
            href={!deactivated() ? href : "#"}
            className={`rounded flex items-center gap-2 px-4 py-2 ${deactivated() ? "text-gray-500 cursor-default" : `cursor-pointer hover:bg-orange-500 hover:dark:bg-orange-500 ${active ? "bg-orange-500/30" : ""} hover:text-white`}`}
        >
            {title}
            {!samePage && <ArrowTopRightOnSquareIcon className={"h-[1em] inline"} />}
        </Link>
    );
};
