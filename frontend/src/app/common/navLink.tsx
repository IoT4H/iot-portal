"use client"
import { ArrowTopRightOnSquareIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import { getStrapiURL, getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";


export const NavLink = (item: any) => {



    const pathname = usePathname();

    const [active, SetActive] = useState<boolean>(false);
    const [samePage, SetSamePage] = useState<boolean>(false);

    useEffect(() => {
        if(typeof window !== 'undefined') {
            console.log(pathname, item.attributes.url, pathname.startsWith(item.attributes.url))
            SetActive(pathname.startsWith(item.attributes.url));
        } else {
            console.log(typeof window, "window")
            SetActive(false);
        }

    }, [item.attributes.url, pathname]);

    useEffect(() => {
        try {
            SetSamePage((new URL(item.attributes.url)).host === getStrapiURLForFrontend());
        } catch (e) {
            SetSamePage(true);
        }
    }, [item.attributes.url]);


    return (
        <Link key={item.attributes.title} href={item.attributes.url} className={`group flex items-center gap-2  border-b-4 pb-4 mt-3 hover:border-orange-500 border-gray-400/30 ${active ? 'border-orange-500/30' : ''} px-4 py-2`} target={item.attributes.target}>{ item.attributes.title }
            {
                !samePage && <ArrowTopRightOnSquareIcon className={"h-[1em] inline"}/>}
            { item.attributes.children.data.length > 0 && (<div className={"submenu fixed left-0 right-0 w-auto top-12 mx-auto max-w-7xl h-auto hidden group-hover:block min-h-[20em] pt-8 z-40"}>
                <div className={"rounded shadow-2xl  cursor-default dark:shadow-orange-500/20 w-1/2 mx-auto min-w-[30%] border-solid border border-orange-500 bg-orange-50 box-content dark:bg-zinc-900 pt-6 px-16 pb-8 text-black dark:text-white"}>
                    <div className={"mb-4 mt-0"}><h2 className={"font-bold text-xl border-solid border-b-4 inline-block mb-2 pr-2 py-1 border-orange-500 "}>{ item.attributes.title }</h2></div>
                    <div className={"grid gap-2 grid-cols-2"}>
                        {
                            item.attributes.children.data.sort((s: any, sv: any) => s.attributes.order - sv.attributes.order).map((child: any) => {

                                let samePage = true;
                                try {
                                    samePage = (new URL(child.attributes.url)).host === getStrapiURL();
                                } catch (e) {

                                }
                                return (<Link key={child.id} href={child.attributes.url} className={`group/link flex w-full flex-row text-black dark:text-white grid-cols-2 items-center gap-2 border-gray-300/40 border-l-4 px-4 py-2 bg-gray-300/20 hover:border-orange-500`} target={child.attributes.target}>{ child.attributes.title }
                                    {!samePage && <ArrowTopRightOnSquareIcon className={"h-[1em] inline "}/>}
                                    <ChevronDoubleRightIcon className={"w-6 inline ml-auto text-black dark:text-white group-hover/link:text-orange-500"}/>
                                </Link>)
                            })
                        }
                    </div>
                </div>
            </div>) } </Link>
    );
}
