"use client"
import { PhotoIcon } from "@heroicons/react/20/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import { fetchAPI, getStrapiURLForFrontend } from '@iot-portal/frontend/lib/api'
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

export const dynamic = 'force-dynamic';
export default function Infopage() {

    const [words, SetWords] = useState<Array<any>>([]);

    const [loading, SetLoading] = useState<boolean>(true);

    useEffect(() => {
        SetLoading(true);
        fetchAPI('/api/glossars', {
            fields: '*',
            populate: '*',
            sort: [
                "word"
            ]
        }).then(
            (response => {
                console.log(response)
                SetWords(response.data);
                SetLoading(false);
            })
        )
    }, []);

    return (
        <div className="flex flex-row content-stretch gap-12">
            <div className="flex-auto rounded bg-white dark:bg-zinc-800 p-4 shadow max-h-full sticky top-0">
                <h2 className={"dark:text-white font-bold text-3xl border-solid border-b-4 inline-block mb-2 pr-2 mt-[1em] py-1 border-orange-500 "}>Wissensseiten</h2>
                <div className={`grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-16 mt-4`}>
                    {
                        Array.isArray(words) && words.map((word: any, index) => {
                            return <div key={word.attributes.slug} className={"w-full h-full"}>
                                <Link href={"/wissen/" + word.attributes.slug} className={"mx-auto min-w-[20rem] max-w-[28rem] block  h-full"}>
                                    <div className={"rounded bg-zinc-500/30 border-gray-500/50 border-1 flex flex-col h-full"}>
                                        {
                                            word.attributes.thumbnail && word.attributes.thumbnail.data && !!word.attributes.thumbnail.data.attributes.url && word.attributes.thumbnail.data.attributes.formats && word.attributes.thumbnail.data.attributes.formats.medium && !!word.attributes.thumbnail.data.attributes.formats.medium.url ? (
                                                <div
                                                    className={" w-full flex-shrink-0 aspect-video cursor-pointer rounded overflow-hidden not-sr-only"}
                                                >
                                                    <GalleryImage thumbnailSrc={getStrapiURLForFrontend() + word.attributes.thumbnail.data.attributes.formats.medium.url } src={getStrapiURLForFrontend() + word.attributes.thumbnail.data.attributes.url}  alt={""}  caption={word.attributes.thumbnail.data.attributes.caption}
                                                                  className={"relative aspect-video max-w-fit max-h-fit min-w-full min-h-full max-w-full max-h-full object-cover "} aria-hidden={"true"} />
                                                </div>
                                            ) : (
                                                <div className={" w-full flex items-center justify-center aspect-video bg-black/20 flex-shrink-0"}><PhotoIcon className={"w-16 h-16 text-black/70"}></PhotoIcon></div>
                                            )
                                        }
                                        <div className={"p-4 flex flex-col h-full flex-grow"}>
                                            <h3 className={"text-xl flex-grow-0 flex-shrink-0 tracking-widest text-white font-bold mb-2"}>{word.attributes.word}</h3>
                                            <p className={"text-gray-100 text-justify"}>{word.attributes.shortdescription}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    );

}
