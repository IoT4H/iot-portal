'use client'

import { GalleryContext } from "@iot-portal/frontend/app/common/galleryContext";
import Gallery from "@iot-portal/frontend/app/common/gallery";
import { Auth, useIsAuth } from "@iot-portal/frontend/lib/auth";
import { useState } from 'react';

export const dynamic = 'force-dynamic';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    const [ viewGallery, setViewGallery] = useState([]);
    const [ viewGalleryIndex, setViewGalleryIndex] = useState(0);


    const isAuth = useIsAuth();

    function openGallery(index: number, gallery: any): void {
        setViewGallery(gallery);
        setViewGalleryIndex(index);
    }

    return (
        <GalleryContext.Provider value={openGallery}>
            {children}
            <Gallery index={viewGalleryIndex} pics={viewGallery}></Gallery>
        </GalleryContext.Provider>
    );
}
