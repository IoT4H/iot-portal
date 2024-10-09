import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import BaseBody from "@iot-portal/frontend/app/common/baseBody";
import { getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";
import Link from "next/link";
import * as React from "react";

export default function BaseLayout(props: any) {
    return (
        <>
            <div className="bg-orange-100 dark:bg-zinc-800 sticky top-16 h-16 z-10">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 h-full flex flex-row items-center">
                    {
                        props.links && props.links.map((link: {  href: string, title: string, deactived: Function }) => {
                                let samePage = true;
                                try {
                                    samePage = (new URL(link.href)).host === getStrapiURLForFrontend();
                                } catch (e) {

                                }

                                return (
                                    <Link key={link.title} href={!link.deactived() ? link.href : "#"}
                                          className={`rounded flex items-center gap-2 px-4 py-2 ${link.deactived() ? 'text-gray-500 cursor-default' : 'cursor-pointer hover:bg-orange-500 hover:dark:bg-orange-500/30 hover:text-white'}`}>{link.title}
                                        {!samePage && <ArrowTopRightOnSquareIcon className={"h-[1em] inline"}/>}
                                    </Link>
                                )
                            }
                        )
                    }
                </div>
            </div>
            {props.children}
        </>
    )
}
