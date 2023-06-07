'use client'

import { GalleryContext } from "@iot-portal/frontend/app/common/galleryContext";
import Gallery from "@iot-portal/frontend/app/common/gallery";
import { useState } from 'react';

const links: {
    href: string;
    title: string;
}[] = [
    {
        title: "Use-Cases",
        href: "/home"
    },
    {
        title: "Meine Use-Cases",
        href: "/home"
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
                        links.map((link) =>
                            (
                                <a key={link.title} href={link.href} className={"rounded px-4 py-2 hover:bg-orange-500 hover:dark:bg-orange-500/30 hover:text-white"}>{ link.title }</a>
                            )
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


