'use client'

import { GalleryContext } from "@iot-portal/frontend/app/common/galleryContext";
import Loading from "@iot-portal/frontend/app/common/loading";
import { ReactNode, Suspense, useContext } from "react";

export default function GalleryImage({src,thumbnailSrc, className,  alt, caption, init, imageList} : {src?: string, thumbnailSrc?:string, className?: string, alt?: string, caption?: string, init?: number, imageList?: any[]}) {

    const gallery = useContext(GalleryContext);

    const image = <img src={thumbnailSrc || src} data-src={src} className={className + " cursor-pointer"} title={caption} onClick={(event) => {

        const list: string[] = [];
        if(!imageList || !init) {
            const collection: HTMLCollection = (event.target.parentElement.getElementsByTagName("img"));

            for (let i = 0; i < collection.length; i++) {

                const objekt = collection.item(i);
                if (objekt === null) {
                    continue;
                }

                const link = objekt.getAttribute("data-src");
                if (link === null) {
                    continue;
                }

                list.push(link)
            }
        }

        gallery(init || list.findIndex((s) => s === src), imageList || list);

    }} alt={alt} loading="lazy" ></img>;

    return (
        < >
            <Suspense fallback={<Loading/>}>
                { image }
            </Suspense>
        </>

    );
}
