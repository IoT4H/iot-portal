'use client'
import { useParams, useRouter } from "next/navigation";
import { MouseEventHandler, useEffect, useState } from "react";
import { mapUseCase, UseCase } from "@iot-portal/frontend/app/(portal)/use-cases";

function Tab({className, name, active, onClick} : {className?: string; name: string; active?: boolean, onClick: MouseEventHandler<HTMLButtonElement> | undefined }){
    return (
        <button onClick={onClick} className={`${className} uppercase mx-4 px-4 py-4 border-b-4 ${ active ? 'border-orange-500 hover:border-orange-500' : 'border-transparent hover:border-orange-500/50' }`}>{name}</button>
    );
}

type Tabs = 'Info' | 'Bilder' | 'Anleitung' | 'Setup';

export default function UseCase() {
    const router = useRouter();
    const params = useParams();
    const [description, setDescription] = useState("");
    const [summary, setSummary] = useState("");
    const [pageTitle, setPageTitle] = useState("");
    const [activeTab, setActiveTab] = useState<Tabs>('Info' );



    useEffect(  () => {

        const fetchData = async () => {
            const useCaseRes = fetch("http://localhost:1337/api/use-cases?populate=*&filters[slug]=" + params.id)
                .then(res => res.json())
                .then((data) => {
                    const useCase = data.data[0];
                    const uAr: UseCase = mapUseCase(useCase);

                    setPageTitle(uAr.title);
                    setDescription(uAr.description);
                    setSummary(uAr.summary);
                });
        };

        fetchData();

    }, [])


    return (
        <>
            <div className="block rounded bg-white dark:bg-zinc-950 p-4 shadow max-h-full sticky top-0">
                <h2 className={"dark:text-white font-bold text-xl border-solid border-b-4 inline-block mb-2 pr-2 py-1 border-orange-500 capitalize "}>{ pageTitle }</h2>
                <p className={"text-sm text-gray-400 py-4"}> { summary }</p>
                <div className={"flex flex-row border-b mb-8 border-gray-300/50"}>
                    <Tab name={"Info"} active={activeTab === 'Info'} onClick={() => setActiveTab('Info')}/>
                    <Tab name={"Bilder"} active={activeTab === 'Bilder'} onClick={() => setActiveTab('Bilder')}/>
                    <Tab name={"Anleitung"} active={activeTab === 'Anleitung'} onClick={() => setActiveTab('Anleitung')}/>
                    <Tab className={"ml-auto"} name={"Demo Setup"} active={activeTab === 'Setup'} onClick={() => setActiveTab('Setup')}/>
                </div>
                <div className={"flex flex-row content-stretch gap-12"}>
                    <div>
                        { activeTab === 'Info' && description }
                        { activeTab === 'Anleitung' && "TEST" }
                        { activeTab === 'Setup' && (
                            <>
                                <div>
                                    SETUP
                                </div>
                                <button className={"bg-orange-500/80 hover:bg-orange-500 p-4 px-8 text-white"} onClick={() => alert("TEST")}>Setup einrichten</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
