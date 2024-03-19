import { PhotoIcon } from "@heroicons/react/20/solid";
import { getStrapiURL } from "@iot-portal/frontend/lib/api";
import Link from "next/link";


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
    setupDuration: number;
    complexity: number;
    instructions: any[];
    costs: number;
    firms: any[];
}

export function mapUseCase(useCase: any): UseCase {
    return {
        id: useCase.id,
        title: useCase.attributes.Titel,
        slug: useCase.attributes.slug,
        thumbnail: useCase.attributes.thumbnail && useCase.attributes.thumbnail.data && useCase.attributes.thumbnail.data.attributes || undefined,
        summary: useCase.attributes.summary,
        description: useCase.attributes.description,
        pictures: useCase.attributes.pictures && useCase.attributes.pictures.data && useCase.attributes.pictures.data.map((b: any) => b.attributes) || undefined,
        tags: (useCase.attributes.tags && useCase.attributes.tags.data.map((t :any) => t.attributes.name)) || [],
        devices:  (useCase.attributes.Images && useCase.attributes.Images.filter((i:any) => i.device.data !== null)) || [],
        setupDuration: useCase.attributes.setupDuration,
        complexity: useCase.attributes.complexity,
        instructions: useCase.attributes.instructions,
        costs: useCase.attributes.costs,
        firms: (useCase.attributes.firms && useCase.attributes.firms.data.map((f :any) => f.attributes)) || []
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

    return (
        <>
            <li className="flex justify-between gap-x-6 py-5 snap-center">
                <Link href={"/usecase/" + useCase.slug} className={"w-full"}>
                    <div className="flex flex-row gap-x-4 rounded-xl p-4 cursor-pointer w-full hover:bg-gray-400/10">
                        <div className={"flex flex-shrink-0 flex-grow-0 items-center flex-row aspect-square h-56 w-56 overflow-hidden rounded"}>
                        {
                            useCase.thumbnail && (
                                    <img src={getStrapiURL() + useCase.thumbnail.formats.medium.url} className={" w-full h-full object-cover gallery-image"}/>
                            ) || (
                                <div className={" w-full h-full flex items-center justify-center bg-black/20"}><PhotoIcon className={"w-16 h-16 text-black/70"}></PhotoIcon></div>
                            )
                        }
                        </div>
                        <div className={"flex-grow w-full"}>
                            <div className="flex flex-row items-center pb-2 z-10">
                                <h3 className={"font-bold text-inherit text-2xl"}>{ useCase.title }</h3>
                            </div>
                            <div className="flex flex-row gap-2 mb-4 flex-wrap">
                                {
                                     [...useCase.devices.map((i :any) => {
                                         return i.device.data && i.device.data.attributes.name;
                                     }), ...useCase.tags].sort().map(b => (<Badge key={b} name={b}/>))
                                }
                            </div>
                            <p className={"dark:text-gray-300 text-sm text-justify"}>{ useCase.summary }</p>
                            <div className="flex flex-row gap-2 my-2 flex-wrap h-12 w-full mt-6">
                                {
                                    useCase.firms.map((f :any) => f.Logo && f.Logo.data && (<img className={"h-full"} key={f.name} title={f.name} src={getStrapiURL(f.Logo.data.attributes.formats.small.url)} alt={f.name}/>))
                                }
                            </div>
                        </div>
                    </div>
                </Link>
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
            <div className="flex-auto rounded bg-white dark:bg-zinc-800 p-4 shadow max-h-full sticky top-0">
                <h2 className={"dark:text-white font-bold text-3xl border-solid border-b-4 inline-block mb-2 pr-2 ml-[1em] mt-[1em] py-1 border-orange-500 "}>{ title }</h2>
                <ul role="list" className="divide-y dark:divide-gray-100/10">
                    { children }
                </ul>
            </div>
        </>
    );
}
