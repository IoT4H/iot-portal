"use client";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { GalleryContext } from "@iot-portal/frontend/app/common/galleryContext";
import Spinner from "@iot-portal/frontend/app/common/spinner";
import { getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";
import { useContext, useEffect, useState } from "react";

export default function Gallery({ index, pics }: { index: number; pics: any[] }) {
    const gallery = useContext(GalleryContext);

    const [canPlay, SetCanPlay] = useState<boolean>(false);
    const [picUrls, SetPicUrls] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(index);

    useEffect(() => {
        SetCanPlay(false);
        setCurrentIndex(index);

        SetPicUrls(
            pics.map((pic) => {
                try {
                    const url = new URL(pic.url);
                    return url.pathname;
                } catch (e) {
                    try {
                        const url = new URL(pic);
                        return url.pathname;
                    } catch (e) {
                        return pic.url;
                    }
                }
            })
        );
    }, [index, pics]);

    return (
        <>
            {pics.length >= 1 && (
                <div
                    className={
                        "fixed w-[100vw] h-[100vh] z-50 top-0 left-0 right-0 bottom-0 flex content-center items-center justify-center bg-gray-50/20 backdrop-blur-[3px]"
                    }
                >
                    <div className={"transition-all ease-out duration-500"}>
                        <div
                            className={
                                "flex flex-row justify-center items-end md:items-stretch relative max-md:flex-wrap flex-nowrap w-[90vw] h-[90vh]"
                            }
                        >
                            <div
                                className={`max-md:order-2 order-1 md:py-8 flex-grow-0 flex-shrink-0 max-md:w-1/2 w-24 flex flex-col items-center justify-center min-h-0 max-md:h-24 ${currentIndex <= 0 ? "opacity-0" : "cursor-pointer"}`}
                                onClick={() => {
                                    if (currentIndex > 0) {
                                        setCurrentIndex(currentIndex - 1);
                                    }
                                }}
                            >
                                <ChevronLeftIcon className={"w-24 h-24"} />
                            </div>
                            <div
                                className={
                                    "max-md:order-1 order-2 flex-shrink transition-all transition-[width] ease-out duration-500 relative flex flex-col gap-2 items-center justify-center md:max-h-full max-h-[80%] max-w-full min-h-0"
                                }
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={
                                        picUrls[currentIndex] &&
                                        getStrapiURLForFrontend() + picUrls[currentIndex]
                                    }
                                    alt={pics[currentIndex]?.alternativeText || ""}
                                    onClick={() => gallery(0, [])}
                                    onLoad={() => SetCanPlay(true)}
                                    className={
                                        (canPlay ? "visible " : "invisible ") +
                                      "min-h-0 min-w-0 w-min h-min transition-all ease-out bg-white duration-500" +
                                      " object-contain max-height-100 cursor-zoom-out"
                                    }
                                />

                                <Spinner
                                    className={`${canPlay ? "hidden" : "w-full"} aspect-square h-24`}
                                />
                                {pics[currentIndex].alternativeText && (
                                    <div
                                        className={
                                            "relative h-10 text-center align-middle dark:bg-zinc-900 float py-2 px-8 empty:hidden rounded"
                                        }
                                    >
                                        {" "}
                                        {pics[currentIndex].alternativeText}
                                    </div>
                                )}
                                {pics[currentIndex] && (
                                    <div
                                        className={
                                            "h-10 text-center align-middle dark:bg-zinc-900 float py-2 px-8 empty:hidden rounded"
                                        }
                                    >
                                        {pics[currentIndex].caption}
                                    </div>
                                )}
                            </div>
                            <div
                                className={`order-3 md:py-8 flex-grow-0 flex-shrink-0 max-md:w-1/2 w-24 flex flex-col items-center justify-center min-h-0  max-md:h-24 ${currentIndex >= picUrls.length - 1 ? "opacity-0" : "cursor-pointer "}`}
                                onClick={() => {
                                    if (currentIndex < picUrls.length - 1) {
                                        setCurrentIndex(currentIndex + 1);
                                    }
                                }}
                            >
                                <ChevronRightIcon className={"w-24 h-24"} />
                            </div>
                            <div
                              className={
                                "w-16 text-white/80 bg-orange-500/50 hover:bg-orange-500/80 hover:text-white" +
                                " absolute top-0 right-0 cursor-pointer z-[90]"
                              }
                              onClick={() => gallery(0, [])}
                            >
                                <XMarkIcon />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
