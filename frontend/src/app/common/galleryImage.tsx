'use client'

import { GalleryContext } from "@iot-portal/frontend/app/common/galleryContext";
import Loading from "@iot-portal/frontend/app/common/loading";
import { ReactNode, Suspense, useContext } from "react";

export default function GalleryImage({src,thumbnailSrc, className,  alt, caption} : {src?: string, thumbnailSrc?:string, className?: string, alt?: string, caption?: string}) {

    const gallery = useContext(GalleryContext);

    const image = <img src={thumbnailSrc || src} data-src={src} className={className + " cursor-pointer"} title={caption} onClick={(event) => {

        const collection: HTMLCollection = (event.target.parentElement.getElementsByTagName("img"));
        const list: string[] = [];

        for(let i = 0; i < collection.length; i++) {

            const objekt = collection.item(i);
            if(objekt === null) {
                continue;
            }

            const link = objekt.getAttribute("data-src");
            if(link === null) {
                continue;
            }

            list.push(link)
        }

        gallery(list.findIndex((s) => s === src), list);

    }} alt={alt} ></img>;

    return (
        < >
            <Suspense fallback={<Loading/>}>
                { image }
            </Suspense>
        </>

    );
}
