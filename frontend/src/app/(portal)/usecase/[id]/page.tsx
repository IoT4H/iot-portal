'use client'
import { useParams, useRouter } from "next/navigation";
import { MouseEventHandler, Suspense, useEffect, useState } from "react";
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

export default function UseCase() {
    const router = useRouter();
    const params = useParams();
    const [activeTab, setActiveTab] = useState<Tabs>('Info' );
    const [useCase, setUseCase] = useState<UseCase>();

    useEffect(  () => {

        const qs = require('qs');
        const query = qs.stringify(
            {
                fields: '*',
                populate: {
                    thumbnail: {
                        populate: '*',
                    },
                    pictures: {
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
                    instructions: {
                        populate: '*',
                    }
                },
                filters: {
                    slug: params.id
                }
            },
            {
                encodeValuesOnly: true, // prettify URL
            }
        );

        const fetchData = async () => {
            const useCaseRes = fetch(`http://localhost:1337/api/use-cases?${query}`)
                .then(res => res.json())
                .then((data) => {
                    setUseCase(mapUseCase(data.data[0]));
                });
        };

        fetchData();

    }, [])

    return (
        useCase && (
        <>
                <div className="block rounded bg-white dark:bg-zinc-800 p-4 shadow max-h-full sticky top-0">
                    <div className={"flex flex-row gap-4"}>
                        {
                            useCase.thumbnail !== undefined && (
                                <div className={"w-3/6 shrink-0"}>
                                    <img src={"http://localhost:1337" + useCase.thumbnail.url} />
                                </div>
                            )
                        }
                        <div className={"flex flex-shrink flex-col"}>
                            <div><h2 className={"dark:text-white font-bold text-3xl border-solid border-b-4 inline-block mb-2 pr-2 py-1 border-orange-500 capitalize "}>{ useCase.title }</h2></div>
                            <div className="flex flex-row gap-2 mt-4 flex-wrap">
                                {
                                    [...useCase.devices.map((i :any) => {
                                        return i.device.data && i.device.data.attributes.name;
                                    }), ...useCase.tags].sort().map(b => (<Badge key={b} name={b}/>))
                                }
                            </div>
                            <p className={"text-sm text-gray-400 py-4"}> { useCase.summary }</p>
                            <div className={"flex flex-row justify-evenly gap-8 my-4"}>
                                <div className={"text-xs flex flex-col items-center gap-2 "} title={"Sensoren"}>
                                    <SignalIcon className={"w-8"}/>
                                    10
                                </div>
                                <div className={"text-xs flex flex-col items-center gap-2 "} title={"Microcontroller"}>
                                    <CpuChipIcon className={"w-8"}/>
                                    3
                                </div>
                                <div className={"text-xs flex flex-col items-center gap-2 "} title={"Computer"}>
                                    <ComputerDesktopIcon className={"w-8"}/>
                                    3
                                </div>
                                <div className={"text-xs flex flex-col items-center gap-2 "} title={"Setup Dauer"}>
                                    <ClockIcon className={"w-8"}/>
                                    {useCase.setupDuration}min
                                </div>
                                <div className={"text-xs flex flex-col items-center gap-2 "} title={"Schwierigkeit"}>
                                    <CodeBracketIcon className={"w-8"}/>
                                    Level {useCase.complexity}
                                </div>
                            </div>
                            <button className={" mt-auto w-full text-center ml-auto bg-orange-500/80 hover:bg-orange-500 text-white flex-row flex gap-4  justify-center items-center uppercase mx-4 px-4 py-4"}><PlayIcon className={"h-4"} />Setup einrichten</button>

                        </div>
                    </div>
                    <div className={"flex flex-row border-b mb-8 border-gray-300/50"}>
                        <Tab name={"Info"} active={activeTab === 'Info'} onClick={() => setActiveTab('Info')}/>
                        <Tab name={"Bilder"} active={activeTab === 'Bilder'} onClick={() => setActiveTab('Bilder')}/>
                        <Tab name={"Anleitung"} active={activeTab === 'Anleitung'} onClick={() => setActiveTab('Anleitung')}/>

                    </div>
                    <div className={"flex flex-row content-stretch gap-12"}>
                        <div>
                            { activeTab === 'Info' && ( <ReactMarkdown className={"markdown mx-8"}>{useCase.description}</ReactMarkdown>) }
                            { activeTab === 'Anleitung' && (
                                useCase.instructions.map((instruction, index) => (
                                    <div key={index} className={"mx-8 border-b py-8 border-gray-500/40"}>
                                        <h2 className={"font-bold pb-1 text-xl inline-block mb-4"}><ChevronDoubleRightIcon className={"w-6 inline text-orange-500"}/> Schritt {index + 1}: {instruction.stepName}</h2>
                                        <p><ReactMarkdown className={"markdown"}>{instruction.step}</ReactMarkdown></p>
                                    </div>
                                ))
                            ) }
                            { activeTab === 'Setup' && (
                                <>
                                    <div>
                                        {
                                            useCase.devices.map((d) => (<p key={d.id}>{d.amount}x {d.device.data.attributes.name}</p>))
                                        }
                                    </div>
                                    <button className={"bg-orange-500/80 hover:bg-orange-500 p-4 px-8 text-white"} onClick={() => alert("TEST")}>Setup einrichten</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
        </>)
    );
}
