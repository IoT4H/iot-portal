'use client'

import { GalleryContext } from "@iot-portal/frontend/app/common/galleryContext";
import { useContext } from "react";

export default function GalleryImage({src, className, init, imageList} : {src?: string, className?: string, init: number, imageList: any[]}) {

    const gallery = useContext(GalleryContext);


    return (
        < >
            <img src={src} className={className} onClick={() => gallery(init, imageList)} />
        </>

    );
}
