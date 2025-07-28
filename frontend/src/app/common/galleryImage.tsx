"use client";

import { InformationCircleIcon } from "@heroicons/react/16/solid";
import { GalleryContext } from "@iot-portal/frontend/app/common/galleryContext";
import Spinner from "@iot-portal/frontend/app/common/spinner";
import { Suspense, useContext } from "react";

export default function GalleryImage({
                                       src,
                                       thumbnailSrc,
                                       className,
                                       wrapperClassName,
                                       alt,
                                       altPreview = true,
                                       caption,
                                       captionPreview = true,
                                       init,
                                       imageList
                                     }: {
    src?: string;
    thumbnailSrc?: string;
    className?: string;
  wrapperClassName?: string;
    alt?: string;
  altPreview?: boolean;
    caption?: string;
  captionPreview?: boolean;
    init?: number;
    imageList?: any[];
}) {
    const gallery = useContext(GalleryContext);

    {
        /* eslint-disable-next-line @next/next/no-img-element */
    }
    const image = (
      <div
          className={`relative bg-transparent flex flex-col justify-center align-center ${wrapperClassName}`}>
        <img
          src={thumbnailSrc || src}
          data-src={src}
          className={` cursor-zoom-in gallery-image order-1 basis-2/3 ${className}`}
          title={caption}
          alt={alt}
          loading="lazy"
          onClick={(event) => {
            const list: any[] = [];
            if (!imageList || !init) {
              const collection: HTMLCollection =
                // @ts-ignore
                event.target.parentElement.getElementsByTagName("img");

              for (let i = 0; i < collection.length; i++) {
                const objekt = collection.item(i);
                if (objekt === null) {
                  continue;
                }

                const link = {
                  url: objekt.getAttribute("data-src"),
                  alternativeText:
                    objekt.getAttribute("title") ||
                    objekt.getAttribute("data-alternativeText"),
                  caption:
                    objekt.getAttribute("alt") ||
                    objekt.getAttribute("data-caption")
                };
                if (link === null) {
                  continue;
                }

                list.push(link);
              }
            }

            gallery(init || list.findIndex((s) => s.url === src), imageList || list);
          }}
        />
        {captionPreview && <Caption text={caption} />}
        {altPreview && <Copyright alt={alt} />}
        </div>
    );

    return (
        <>
            <Suspense fallback={<Spinner />}>{image}</Suspense>
        </>
    );
}

export function Copyright({ alt }: { alt?: string }) {
    return (
        <>
            {!!alt && (
                <div
                    className={
                        "min-h-10 absolute top-0 right-0 flex flex-row items-center bg-gray-500/80 py-1 px-2" +
                        " text-ellipsis text-right rounded-bl-lg max-w-full cursor-help z-[1] text-sm"
                    }
                    title={alt}
                >
                    <InformationCircleIcon
                        className={"h-4 w-4 shrink-0 aspect-square mr-1 inline"}
                    />
                    {alt}
                </div>
            )}
        </>
    );
}

export function Caption({ text }: { text?: string }) {
  return (
    <>
      {!!text && (
        <div
          className={
              "py-2 px-4 block top-0 right-0 items-center bg-zinc-700 text-ellipsis flex-grow-0" +
              " w-full text-center justify-stretch text-wrap overflow-wrap rounded-r" +
              " whitespace-pre-line break-normal hyphens-auto inline-block  max-h-full order-2"
          }>
            {text}
        </div>
      )}
    </>
  );
}
