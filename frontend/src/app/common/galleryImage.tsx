'use client'

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { GalleryContext } from "@iot-portal/frontend/app/common/galleryContext";
import Loading from "@iot-portal/frontend/app/common/loading";
import Spinner from "@iot-portal/frontend/app/common/spinner";
import { Cabin } from "next/dist/compiled/@next/font/dist/google";
import { ReactNode, Suspense, useContext } from "react";

export default function GalleryImage({src, thumbnailSrc, className,  alt, caption, init, imageList} : {src?: string, thumbnailSrc?:string, className?: string, alt?: string, caption?: string, init?: number, imageList?: any[]}) {

    const gallery = useContext(GalleryContext);

    {/* eslint-disable-next-line @next/next/no-img-element */}
    const image = <div className={`relative ${className} bg-gray-950/5`}><img src={thumbnailSrc || src} data-src={src} className={` cursor-zoom-in gallery-image ${className}`} title={caption} alt={alt} loading="lazy" onClick={(event) => {

        const list: any[] = [];
        if(!imageList || !init) {
            // @ts-ignore
            const collection: HTMLCollection = (event.target.parentElement.getElementsByTagName("img"));

            for (let i = 0; i < collection.length; i++) {

                const objekt = collection.item(i);
                if (objekt === null) {
                    continue;
                }

                const link = { url: objekt.getAttribute("data-src"), alternativeText: objekt.getAttribute("title") || objekt.getAttribute("data-alternativeText")  , caption: objekt.getAttribute("alt") || objekt.getAttribute("data-caption") } ;
                if (link === null) {
                    continue;
                }

                list.push(link)
            }
        }

        gallery(init || list.findIndex((s) => s.url === src), imageList || list);

    }}  />
        <Copyright alt={alt} />
    </div> ;

    return (
        < >
            <Suspense fallback={<Spinner />}>
                { image }
            </Suspense>
        </>

    );
}

export function Copyright({ alt } : { alt?: string }) {
    return <>
        { !!alt && <div className={"h-8 absolute bottom-0 left-0 flex flex-row items-center bg-gray-300/20 px-2 text-ellipsis rounded-tr max-w-full cursor-help text-left"} title={alt}><InformationCircleIcon className={"h-6 w-6 shrink-0 aspect-square mr-1 inline"}/>{ alt }</div>}
    </>;
}
