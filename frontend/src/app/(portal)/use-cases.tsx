'use client'
import { StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarFilledIcon } from "@heroicons/react/24/solid"
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link"


export type UseCase = {
    id: number;
    title: string;
    slug: string;
    thumbnail?: string;
    summary: string;
    description: string;
    images?: string[];
    tags?: string[];
    devices: string[];
}

export function mapUseCase(useCase: any): UseCase {
    return {
        id: useCase.id,
        title: useCase.attributes.Titel,
        slug: useCase.attributes.slug,
        thumbnail: useCase.attributes.Thumbnail && useCase.attributes.Thumbnail.data && mapImageData(useCase.attributes.Thumbnail.data) || undefined,
        summary: useCase.attributes.summary,
        description: useCase.attributes.description,
        images: useCase.attributes.Bilder && useCase.attributes.Bilder.data && useCase.attributes.Bilder.data.map((b: any) => mapImageData(b)) || undefined,
        tags: (useCase.attributes.tags && useCase.attributes.tags.data.map((t :any) => t.attributes.name)) || [],
        devices:  (useCase.attributes.Images && useCase.attributes.Images.map((i :any) => {
            return i.device.data && i.device.data.attributes.name || undefined;
        })) || []
    }
}

function mapImageData({
    image
                      } : {image: any}): string {
    return image && "http://localhost:1337" + image.attributes.url
}

export function Badge({ name } : { name: string; color?: string; }) {
    return (
        <span
            className={"inline-flex items-center rounded-md dark:dark:bg-gray-100/10 bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-700/10"}>
            { name }
        </span>
    );
}

export function ListItemUseCase({useCase}: {useCase: UseCase}) {
    const [ marked, setMarked ] = useState(false)
    const router = useRouter();

    const markUseCase = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setMarked(!marked);
    }

    return (
        <>
            <li className="flex justify-between gap-x-6 py-5" onClick={() => router.push("/usecase/" + useCase.slug)}>
                <div className="flex flex-row gap-x-4 rounded-xl p-4 cursor-pointer w-full hover:bg-gray-400/10">
                    {
                        useCase.thumbnail && (
                            <div className={"flex flex-grow-0 items-center flex-row w-fit"}>
                                <img src={useCase.thumbnail} className={""}/>
                            </div>
                        )
                    }
                    <div className={"flex-grow w-full"}>
                        <div className="flex flex-row items-center pb-2 z-10">
                            <div onClick={(e) => markUseCase(e)}>
                            {
                                marked ? <StarFilledIcon className={"text-yellow-400 inline-block h-5 w-5 mr-2"}/> : <StarIcon  className={"text-yellow-400 inline-block h-5 w-5 mr-2"}/>
                            }</div>
                            <h3 className={"font-bold text-inherit"}>{ useCase.title }</h3>
                        </div>
                        <p className={"dark:text-gray-300 text-sm"}>{ useCase.description }</p>
                        <div className="flex flex-row gap-2 mt-4 flex-wrap">
                            {
                                useCase.tags && useCase.tags.map(tag => (<Badge key={tag} name={tag}/>))
                            }
                            {
                                useCase.devices && useCase.devices.map(device => (<Badge key={device} name={device}/>))
                            }
                        </div>
                    </div>
                    <div className={"flex flex-grow-0 items-center flex-row"}>
                        <ChevronRightIcon  className={"w-6 h-6"}/>
                    </div>
                </div>
            </li>
        </>
    );
}

export function ListUseCase ({  title,
                                 children,
                             }: {
    title: string;
    children: React.ReactNode
}) {
    return (
        <>
            <div className="flex-auto rounded bg-white dark:bg-zinc-950 p-4 shadow max-h-full sticky top-0">
                <h2 className={"dark:text-white font-bold text-xl border-solid border-b-4 inline-block mb-2 pr-2 py-1 border-orange-500 "}>{ title }</h2>
                <ul role="list" className="divide-y dark:divide-gray-100/10">
                    { children }
                </ul>
            </div>
        </>
    );
}
