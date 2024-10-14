import { PhotoIcon } from "@heroicons/react/20/solid";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
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
    setupSteps: any[];
}

export function mapUseCase(useCase: any): UseCase {
    return {
        id: useCase.id,
        title: useCase.attributes.Titel,
        slug: useCase.attributes.slug,
        thumbnail: useCase.attributes.thumbnail && useCase.attributes.thumbnail.data && useCase.attributes.thumbnail.data.attributes && useCase.attributes.thumbnail.data.attributes.url && useCase.attributes.thumbnail.data.attributes || undefined,
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
        setupSteps: useCase.attributes.setupSteps || []
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
            <div className="flex justify-between gap-x-6 snap-center">
                <Link href={"/usecase/" + useCase.slug} className={"w-full group/card"}>
                    <div className="flex flex-col-reverse cursor-pointer w-full min-h-64 dark:bg-zinc-900 overflow-hidden h-full border border-gray-500/25 group-hover/card:border-orange-500/25">
                        <div className={"flex flex-grow-0 flex-shrink-0 items-center flex-row w-full h-64 relative "}>
                            {
                                useCase.thumbnail && useCase.thumbnail.url && (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={getStrapiURLForFrontend() + (useCase.thumbnail.formats.medium.url || useCase.thumbnail.url)}
                                        className={" w-full h-full object-cover gallery-image"}/>
                                ) || (
                                    <div
                                        className={" w-full h-full flex items-center justify-center bg-black/20  gallery-image"}>
                                        <PhotoIcon className={"w-16 h-16 text-black/70 dark:text-white/30"}></PhotoIcon>
                                    </div>
                                )
                            }
                            <button
                                className={"absolute bottom-2 right-2 text-right mt-auto ml-auto font-bold bg-orange-500/90 text-white pl-4 pr-2 py-2 w-max flex flex-row gap-2 items-center invisible group-hover/card:visible"}>
                                <span>Erfahre mehr</span><ChevronRightIcon className={"h-6"}/></button>

                        </div>
                        <div
                            className={"w-full h-full flex flex-col gap-4 p-8 min-h-[auto]"}>
                            <div className="">
                                <h2 className="text-inherit font-bold text-2xl border-solid border-b-[0.2em] inline-block max-w-full pr-[0.5em] py-1 border-orange-500 pb-[1px]">{useCase.title}</h2>
                            </div>
                            <div className="flex flex-row gap-2 flex-wrap flex-grow-0 flex-shrink empty:hidden">
                                {
                                    [...useCase.devices.map((i :any) => {
                                         return i.device.data && i.device.data.attributes.name;
                                     }), ...useCase.tags].sort().map(b => (<Badge key={b} name={b}/>))
                                }
                            </div>
                            <p className={"dark:text-gray-300 text-sm text-justify min-w-0 min-h-0 overflow-hidden text-ellipsis hyphens-auto break-words  flex-grow-0 flex-shrink text-wrap"}>{ useCase.summary }</p>
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
    title?: string;
    children: React.ReactNode
}) {
    return (
        <>
            <div className="flex-auto rounded shadow max-h-full sticky top-0">
                <div className={"grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4"}>
                    { children }
                </div>
            </div>
        </>
    );
}
