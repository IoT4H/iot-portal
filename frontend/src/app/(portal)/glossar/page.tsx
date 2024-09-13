"use client"
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { fetchAPI } from '@iot-portal/frontend/lib/api'
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
                <div className={`flex flex-col gap-4 mt-4`}>
                {
                        loading ? <>
                            <div className={"h-24 bg-zinc-500/30 border-gray-500/50  rounded animate-pulse delay-0"}></div>
                            <div className={"h-24 bg-zinc-500/30 border-gray-500/50  rounded animate-pulse delay-100"}></div>
                            <div className={"h-24 bg-zinc-500/30 border-gray-500/50  rounded animate-pulse delay-200"}></div>
                            <div className={"h-24 bg-zinc-500/30 border-gray-500/50  rounded animate-pulse delay-300"}></div>
                            <div className={"h-24 bg-zinc-500/30 border-gray-500/50  rounded animate-pulse delay-400"}></div>
                        </> : <> {
                            Array.isArray(words) && words.map((word: any, index) => {
                                return <Link key={index} href={"/glossar/" + word.attributes.slug}>
                                    <div className={"rounded bg-zinc-500/30 border-gray-500/50 border-1 p-4"}>
                                        <h3 className={"text-2xl font-extrabold mb-2"}>{word.attributes.word}</h3>
                                        <p>{word.attributes.shortdescription}</p>
                                    </div>
                                </Link>
                            })
                        }</>
                    }
                </div>
            </div>
        </div>
    );

}
