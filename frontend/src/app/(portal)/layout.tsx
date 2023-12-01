'use client'

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { GalleryContext } from "@iot-portal/frontend/app/common/galleryContext";
import Gallery from "@iot-portal/frontend/app/common/gallery";
import { getStrapiURL } from "@iot-portal/frontend/lib/api";
import Link from "next/link";
import { useState } from 'react';

const links: {
    href: string;
    title: string;
    deactive: boolean;
}[] = [
    {
        title: "Use-Cases",
        href: "/home",
        deactive: false,
    },
    {
        title: "Meine Use-Cases",
        href: "/home",
        deactive: true,
    }
];



export default function PortalLayout({ children }: { children: React.ReactNode }) {
    const [ viewGallery, setViewGallery] = useState([]);
    const [ viewGalleryIndex, setViewGalleryIndex] = useState(0);

    function openGallery(index: number, gallery: any): void {
        setViewGallery(gallery);
        setViewGalleryIndex(index);
    }

    return (
        <GalleryContext.Provider value={openGallery}>
            <div className="bg-orange-100 dark:bg-zinc-900 sticky top-16 h-16">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 h-full flex flex-row items-center">
                    {
                        links.map((link) => {
                                let samePage = true;
                                try {
                                    samePage = (new URL(link.href)).host === getStrapiURL();
                                } catch (e) {

                                }

                                return (
                                    <Link key={link.title} href={!link.deactive ? link.href : "#"}
                                          className={`rounded flex items-center gap-2 px-4 py-2 ${!link.deactive && 'hover:bg-orange-500 hover:dark:bg-orange-500/30 hover:text-white'} ${link.deactive && 'text-gray-500'}`}>{link.title}
                                        {!samePage && <ArrowTopRightOnSquareIcon className={"h-[1em] inline"}/>}
                                    </Link>
                                )
                            }
                        )
                    }
                </div>
            </div>
            <div className={"h-28 bg-orange-100 dark:bg-zinc-900 shadow sticky top-32 -z-10"}></div>
            <div className="mx-auto max-w-7xl py-2 sm:px-6 lg:px-8 -mt-28  w-full">
                {children}
            </div>
            {
                <Gallery index={viewGalleryIndex} pics={viewGallery}></Gallery>
            }
        </GalleryContext.Provider>
    );
}


