import { PhotoIcon } from "@heroicons/react/20/solid";
import { getStrapiURL, getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";
import Link from "next/link";
import * as React from "react";


export const dynamic = 'force-dynamic';

export type UseCase = {
    id: number;
    title: string;
    slug: string;
    thumbnail?: any;
    summary: string;
    description: string;
    pictures?: any[];
    tags: string[];
    devices: any[];
    setupDuration?: number | null;
    complexity?: number | null;
    instructions: any[];
    costs?: number | null;
    firms: any[];
    partnerLogos: any[];
}

export function mapUseCase(useCase: any): UseCase {
    return {
        id: useCase.id,
        title: useCase.attributes.Titel,
        slug: useCase.attributes.slug,
        thumbnail: useCase.attributes.thumbnail && useCase.attributes.thumbnail.data && useCase.attributes.thumbnail.data.attributes || undefined,
        summary: useCase.attributes.summary,
        description: useCase.attributes.description,
        pictures: useCase.attributes.pictures && useCase.attributes.pictures.data && useCase.attributes.pictures.data.map((b: any) => b.attributes) || [],
        tags: (useCase.attributes.tags && useCase.attributes.tags.data.map((t :any) => t.attributes.name)) || [],
        devices:  (useCase.attributes.Images && useCase.attributes.Images.filter((i:any) => i.device.data !== null)) || [],
        setupDuration: useCase.attributes.setupDuration,
        complexity: useCase.attributes.complexity,
        instructions: useCase.attributes.instructions,
        costs: useCase.attributes.costs,
        firms: (useCase.attributes.firms && useCase.attributes.firms.data.map((f :any) => f.attributes)) || [],
        partnerLogos: useCase.attributes.partnerLogos && useCase.attributes.partnerLogos.data && useCase.attributes.partnerLogos.data.map((b: any) => b.attributes) || [],
    }
}


export function Badge({ name } : { name: string; color?: string; }) {
    return (
        <span
            className={"inline-flex items-center rounded-md dark:dark:bg-gray-100/10 bg-orange-50 px-2 py-1 text-xs font-medium text-orange-500 ring-1 ring-inset ring-orange-500/10"}>
            { name }
        </span>
    );
}

export function ListItemUseCase({useCase}: {useCase: UseCase}) {

    console.log(useCase.partnerLogos)

    return (
        <>
            <div className="flex justify-between gap-x-6 py-5 snap-center">
                <Link href={"/usecase/" + useCase.slug} className={"w-full"}>
                    <div className="flex flex-row gap-x-4 rounded-xl p-8 cursor-pointer w-full min-h-64 bg-zinc-200 hover:bg-zinc-300 dark:bg-gray-400/10 dark:hover:bg-gray-400/20 border border-gray-500/25 overflow-hidden h-full">
                        <div className={"flex flex-shrink-0 items-center flex-row w-64 min-h-[16rem] -m-8 mr-8"}>
                        {
                            useCase.thumbnail && useCase.thumbnail.url && (
                                    <img src={getStrapiURLForFrontend() + (useCase.thumbnail.formats.medium.url || useCase.thumbnail.url)} className={" w-full h-full object-cover gallery-image"}/>
                            ) || (
                                <div className={" w-full h-full flex items-center justify-center bg-black/20  gallery-image"}><PhotoIcon className={"w-16 h-16 text-black/70"}></PhotoIcon></div>
                            )
                        }
                        </div>
                        <div className={"flex-grow w-full h-full flex flex-col gap-4"}>
                            <div className="flex flex-row items-center z-10 flex-grow-0">
                                <h2 className="text-inherit font-bold text-2xl border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]">{useCase.title}</h2>
                            </div>
                            <div className="flex flex-row gap-2 flex-wrap flex-grow-0 flex-shrink">
                                {
                                    [...useCase.devices.map((i :any) => {
                                         return i.device.data && i.device.data.attributes.name;
                                     }), ...useCase.tags].sort().map(b => (<Badge key={b} name={b}/>))
                                }
                            </div>
                            <p className={"dark:text-gray-300 text-sm text-justify my-auto"}>{ useCase.summary }</p>
                        </div>
                    </div>
                </Link>
            </div>
        </>
    );
}

export function ListUseCase({
                                title,
                                children,
                            }: {
    title: string;
    children: React.ReactNode
}) {
    return (
        <>
            <div className="flex-auto rounded bg-white dark:bg-zinc-800 p-8 shadow max-h-full sticky top-0">
                <h2 className={"dark:text-white font-bold text-3xl border-solid border-b-4 inline-block mb-2 pr-2 mt-[1em] py-1 border-orange-500 "}>{ title }</h2>
                <div>
                    { children }
                </div>
            </div>
        </>
    );
}
