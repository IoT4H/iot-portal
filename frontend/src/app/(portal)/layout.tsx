'use client'

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { AuthContext } from "@iot-portal/frontend/app/common/AuthContext";
import BaseLayout from "@iot-portal/frontend/app/common/baseLayout";
import { GalleryContext } from "@iot-portal/frontend/app/common/galleryContext";
import Gallery from "@iot-portal/frontend/app/common/gallery";
import { getStrapiURL, getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";
import { Auth, useIsAuth } from "@iot-portal/frontend/lib/auth";
import Link from "next/link";
import { useContext, useEffect, useState } from 'react';

type Link = {
    href: string;
    title: string;
    deactived: () => boolean;
}

export const dynamic = 'force-dynamic';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    const [ viewGallery, setViewGallery] = useState([]);
    const [ viewGalleryIndex, setViewGalleryIndex] = useState(0);


    const isAuth = useIsAuth();

    function openGallery(index: number, gallery: any): void {
        setViewGallery(gallery);
        setViewGalleryIndex(index);
    }

    const links: Link[] = [
        {
            title: "Anwendungsfälle",
            href: "/usecase/",
            deactived: () => false,
        },
        {
            title: "Meine Anwendungsfälle",
            href: "/mine/",
            deactived: () => !isAuth,
        }
    ];

    return (
        <GalleryContext.Provider value={openGallery}>
            <BaseLayout links={links}>
                {children}
            </BaseLayout>
            {
                <Gallery index={viewGalleryIndex} pics={viewGallery}></Gallery>
            }
        </GalleryContext.Provider>
    );
}
