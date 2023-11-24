'use client'

import { GalleryContext } from "@iot-portal/frontend/app/common/galleryContext";
import Loading from "@iot-portal/frontend/app/common/loading";
import { Suspense, useContext } from "react";

export default function GalleryImage({src, className, init, imageList, alt} : {src?: string, className?: string, init: number, imageList: any[], alt?: string}) {

    const gallery = useContext(GalleryContext);

    return (
        < >
            <Suspense fallback={<Loading/>}>
                <img src={src} className={className + " cursor-pointer"} onClick={() => gallery(init, imageList)} alt={alt} />
            </Suspense>
        </>

    );
}
