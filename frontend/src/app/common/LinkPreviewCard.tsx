"use client"
import { PhotoIcon } from "@heroicons/react/20/solid";
import { TextSkeleton } from "@iot-portal/frontend/app/common/skeletons/textWithHeadline";
import { fetchAPI, getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";

const LinkPreviewCard = ({ href } : { href: string}) => {

    const [wordPage, SetWordPage] = useState<any>( undefined);
    const [wordSlug, SetWordSlug] = useState<string | undefined>(undefined);

    const hoverLoad = useCallback((slug: string) => {
            fetchAPI('/api/glossars', {
                fields: '*',
                populate: {
                  thumbnail: {
                      populate: true
                  }
                },
                filters: {
                    slug: {
                        $eq: slug,
                    },
                },
            }).then((response) => {
                let data = response.data;
                SetWordPage(Array.isArray(data) && data.length > 0 ? data[0].attributes : undefined)
            })
    }, []);

    useEffect(() => {
        if(wordPage === undefined && wordSlug !== undefined) {
            hoverLoad(wordSlug);
        }
    }, [wordSlug]);

    useEffect(() => {
        if(href) {
            const matches = href.match(".*/wissen/(.*)/?$");
            if (matches !== null && matches !== undefined) {
                SetWordSlug(matches[1]);
            } else {
                SetWordSlug(undefined);
            }
        }
    }, [href]);


    return <>
        { wordPage && (
            <div
                className={"hidden group-hover/link:block hover:block absolute z-10 min-h-72 w-72 bg-transparent left-[calc(50%_-_9rem)] -mt-4 pt-6 "}>
                <div
                    className={"bg-zinc-700 rounded-xl overflow-hidden w-full h-full flex flex-col dark:text-white border border-zinc-300/50"}>
                    <div className={"aspect-video h-36"}>
                        {
                            (wordPage.thumbnail?.data?.attributes?.formats?.small?.url || wordPage.thumbnail?.data?.attributes?.url) ? (
                                <div
                                    className={"w-full h-full shrink aspect-video rounded overflow-hidden not-sr-only"}
                                >
                                    <img
                                        src={getStrapiURLForFrontend(wordPage.thumbnail?.data.attributes.formats?.small?.url || wordPage.thumbnail?.data.attributes.url)}
                                        alt={wordPage.word}
                                        className={"relative aspect-video max-w-fit max-h-fit min-w-full min-h-full max-w-full max-h-full object-center object-cover "}
                                        aria-hidden={"true"}/>
                                </div>
                            ) : (
                                <div className={"flex items-center justify-center aspect-video bg-black/20 w-full h-full "}>
                                    <PhotoIcon className={"w-16 h-16 text-black/70"}></PhotoIcon></div>
                            )
                        }
                    </div>
                    <div className={" py-4 px-6"}>
                        <h3
                            className="dark:text-white font-bold text-lg mb-2 border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]">{wordPage?.word}</h3>
                        <p className={"font-normal text-sm text-left break-words whitespace-pre-wrap"}>{wordPage?.shortdescription }</p>
                    </div>
                </div>
            </div>
        )}

    </>
}

export default LinkPreviewCard;
