import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import BaseBody from "@iot-portal/frontend/app/common/baseBody";
import { BaseLayoutLink } from "@iot-portal/frontend/app/common/baseLayoutLink";
import { getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";
import Link from "next/link";
import * as React from "react";

export default function BaseLayout(props: any) {
    return (
        <>
            <div className="bg-orange-100 dark:bg-zinc-800 sticky top-16 h-16 z-10">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 h-full flex flex-row items-center gap-x-2">
                    {
                        props.links && props.links.map((link: {  href: string, title: string, deactived: Function }) => {
                                return (<BaseLayoutLink key={link.title} {...link} />);
                            }
                        )
                    }
                </div>
            </div>
            {props.children}
        </>
    )
}
