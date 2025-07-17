"use client";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
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
        className={`relative bg-transparent flex flex-row ${wrapperClassName}`}>
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
                      "h-8 absolute bottom-0 left-0 flex flex-row items-center bg-gray-500 px-2 text-ellipsis text-left" +
                      " rounded-tr max-w-full cursor-help z-[1]"
                    }
                    title={alt}
                >
                    <InformationCircleIcon
                        className={"h-6 w-6 shrink-0 aspect-square mr-1 inline"}
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
            "p-8 block top-0 right-0 items-center bg-zinc-700 text-ellipsis flex-grow-0" +
            " w-fit max-w-max text-center justify-stretch text-wrap overflow-wrap rounded-r" +
            " whitespace-pre-line break-normal indent-4 hyphens-auto inline-block  max-h-full order-2"
          }>
          {text}a asd asd asd as dasd asd asdadasd asdgdfg dfg dfg df gdfg f
        </div>
      )}
    </>
  );
}
