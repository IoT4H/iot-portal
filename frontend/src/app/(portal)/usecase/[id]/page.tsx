'use client'
import Gallery from "@iot-portal/frontend/app/common/gallery";
import { GalleryContext } from "@iot-portal/frontend/app/common/galleryContext";
import { fetchAPI, getStrapiURL } from "@iot-portal/frontend/lib/api";
import { useParams, useRouter } from "next/navigation";
import { Context, createContext, MouseEventHandler, Suspense, useContext, useEffect, useState } from "react";
import { Badge, mapUseCase, UseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import {
    PlayIcon,
    ChevronDoubleRightIcon
} from "@heroicons/react/24/solid";
import {
    ClockIcon,
    CodeBracketIcon,
    ComputerDesktopIcon,
    CpuChipIcon,
    SignalIcon
} from "@heroicons/react/20/solid";
import ReactMarkdown from "react-markdown";

type HeroIcon = React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & {     title?: string | undefined;     titleId?: string | undefined; } & React.RefAttributes<SVGSVGElement>>;

function Tab({Icon, className, name, active, onClick} : {Icon?: HeroIcon; className?: string; name: string; active?: boolean, onClick?: MouseEventHandler<HTMLButtonElement> | undefined }){
    return (
        <button onClick={onClick} className={`${className} flex-row flex gap-4 items-center uppercase mx-4 px-4 py-4 border-b-2 ${ active ? 'border-orange-500 hover:border-orange-500' : 'border-transparent hover:border-orange-500/50' }`}>{ Icon && (<Icon className={"h-4"}/>)} {name}</button>
    );
}

type Tabs = 'Info' | 'Bilder' | 'Anleitung' | 'Setup';


function PictureGallery({ pictures } : {pictures?: any[]}) {

    const gallery = useContext(GalleryContext);

    return (
        <div className={"grid grid-cols-[repeat(auto-fill,_minmax(224px,_1fr))] gap-2"}>
            { pictures && pictures.map((pic, index, allPics) => {
                return (
                    <div
                        key={pic.hash}
                        className={"flex cursor-pointer relative flex-col items-center flex-wrap content-center align-center justify-center truncate w-full aspect-square"}
                        onClick={() => gallery(index, allPics)}
                    >
                        <img src={getStrapiURL() + pic.formats.thumbnail.url} className={"absolute max-w-fit max-h-fit min-w-full min-h-full "} />
                    </div>
                );
            })}
        </div>
    );
}

function Instructions({ instructions } : { instructions: any[]}) {

    const gallery = useContext(GalleryContext);

    return (
        <>
        { instructions && instructions.map((instruction, index) => (
                <div key={index} className={"mx-8 border-b py-8 border-gray-500/40"}>
                    <h2 className={"font-bold pb-1 text-xl inline-block mb-4"}><ChevronDoubleRightIcon className={"w-6 inline text-orange-500"}/> Schritt {index + 1}: {instruction.stepName}</h2>
                    <p><ReactMarkdown className={"markdown"}>{instruction.step}</ReactMarkdown></p>
                    <div className={"grid grid-cols-[repeat(auto-fill,_minmax(100px,_1fr))] gap-2 py-4"}>
                        { instruction.pictures && instruction.pictures.data && instruction.pictures.data.map((pic: any, index: number, allPics: any[]) => {
                            return (
                                <div
                                    key={pic.attributes.hash}
                                    className={"flex cursor-pointer relative flex-col items-center flex-wrap content-center align-center justify-center truncate w-full aspect-square"}
                                    onClick={() => gallery(index, allPics.map(p => p.attributes))}
                                >
                                    <img src={getStrapiURL() + pic.attributes.formats.thumbnail.url} className={"absolute max-w-fit max-h-fit min-w-full min-h-full "} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )) }
        </>
    );
}

function Info({ description } : { description: string; }) {
    return (<ReactMarkdown className={"markdown mx-8"}>{description}</ReactMarkdown>);
}

export default function UseCase() {
    const router = useRouter();
    const params = useParams();
    const [activeTab, setActiveTab] = useState<Tabs>('Info' );
    const [useCase, setUseCase] = useState<UseCase>();

    const gallery = useContext(GalleryContext);

    useEffect(() => {
        console.log(useCase);
    }, [useCase]);

    useEffect(  () => {

        console.log(params.id)

        const qsPara =
            {
                fields: '*',
                populate: {
                    thumbnail: {
                        populate: '*',
                    },
                    tags: {
                        populate: '*',
                    },
                    Images: {
                        populate: '*',
                        device : {
                            populate: "*"
                        }
                    },
                    pictures: {
                        populate: '*',
                    },
                    instructions: {
                        populate: '*',
                    }
                },
                filters: {
                    slug: {
                        $eq: params.id,
                    },
                },
            }
        ;

        fetchAPI('/use-cases', qsPara).then((data) => {
            setUseCase(mapUseCase(data.data[0]));
        });

    }, [])

    return (
        useCase && (
        <>
                <div className="block rounded bg-white dark:bg-zinc-800 p-6 shadow max-h-full sticky top-0 flex flex-col gap-4">
                    <div className={"flex flex-row gap-8"}>
                        {
                            useCase.thumbnail !== undefined && (
                                <div className={"w-6/12 shrink-0 cursor-pointer"}
                                     onClick={() => gallery(0, [useCase.thumbnail])}
                                >
                                    <div className={"flex relative flex-col items-center flex-wrap content-center align-center justify-center truncate w-full h-full"}>
                                        <img src={getStrapiURL() + useCase.thumbnail.formats.medium.url}  className={"absolute max-w-fit max-h-fit min-w-full min-h-full "} />
                                    </div>
                                </div>
                            )
                        }
                        <div className={"flex flex-shrink flex-col"}>
                            <div><h2 className={"dark:text-white font-bold text-3xl border-solid border-b-4 inline-block mb-2 pr-2 py-1 border-orange-500 capitalize "}>{ useCase.title }</h2></div>
                            <div className="flex flex-row gap-2 mt-4 flex-wrap text-orange-500">
                                {
                                    [...useCase.devices.map((i :any) => {
                                        return i.device.data && i.device.data.attributes.name;
                                    }), ...useCase.tags].sort().map(b => (<Badge key={b} name={b}/>))
                                }
                            </div>
                            <p className={"text-sm text-gray-400 py-4"}> { useCase.summary }</p>
                            <div className={"flex flex-row justify-evenly gap-8 my-4"}>
                                <div className={"text-xs flex flex-col items-center gap-2 text-center"} title={"Sensoren"}>
                                    <SignalIcon className={"w-8"}/>
                                    10
                                </div>
                                <div className={"text-xs flex flex-col items-center gap-2  text-center"} title={"Microcontroller"}>
                                    <CpuChipIcon className={"w-8"}/>
                                    3
                                </div>
                                <div className={"text-xs flex flex-col items-center gap-2  text-center"} title={"Computer"}>
                                    <ComputerDesktopIcon className={"w-8"}/>
                                    3
                                </div>
                                <div className={"text-xs flex flex-col items-center gap-2  text-center"} title={"Setup Dauer"}>
                                    <ClockIcon className={"w-8"}/>
                                    {useCase.setupDuration}min
                                </div>
                                <div className={"text-xs flex flex-col items-center gap-2  text-center"} title={"Schwierigkeit"}>
                                    <CodeBracketIcon className={"w-8"}/>
                                    Level {useCase.complexity}
                                </div>
                            </div>
                            <button className={" mt-auto w-full text-center ml-auto bg-orange-500/80 hover:bg-orange-500 text-white flex-row flex gap-4  justify-center items-center uppercase mx-4 px-4 py-4"}><PlayIcon className={"h-4"} />Setup einrichten</button>

                        </div>
                    </div>
                    <div className={"pb-8"}>
                        <div className={"flex flex-row border-b mb-8 border-gray-300/50"}>
                            <Tab name={"Info"} active={activeTab === 'Info'} onClick={() => setActiveTab('Info')}/>
                            <Tab name={"Bilder"} active={activeTab === 'Bilder'} onClick={() => setActiveTab('Bilder')}/>
                            <Tab name={"Anleitung"} active={activeTab === 'Anleitung'} onClick={() => setActiveTab('Anleitung')}/>

                        </div>
                        <div className={"w-full"}>
                                { activeTab === 'Info' && ( <Info description={useCase.description} />) }
                                { activeTab === 'Anleitung' && ( <Instructions instructions={useCase.instructions}/>) }
                                { activeTab === 'Bilder' && ( <PictureGallery pictures={useCase.pictures} />)}
                        </div>
                    </div>
                </div>
        </>)
    );
}
