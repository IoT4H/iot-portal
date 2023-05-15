'use client'
import { fakerDE as faker } from "@faker-js/faker"
import { useParams, useRouter } from "next/navigation";
import { MouseEventHandler, useEffect, useState } from "react";
import { UseCase } from "@iot-portal/frontend/app/(portal)/use-cases";


const initDescription = faker.lorem.paragraphs(2);
const iniTitle = faker.word.words({ count: 3});

function Tab({name, active, onClick} : {name: string; active?: boolean, onClick: MouseEventHandler<HTMLButtonElement> | undefined }){
    return (
        <button onClick={onClick} className={`uppercase mx-4 px-4 py-4 hover:border-orange-500 border-b-4 ${ active ? 'border-orange-500' : 'border-transparent' }`}>{name}</button>
    );
}

export default function UseCase() {
    const router = useRouter();
    const params = useParams();
    const [description, setDescription] = useState("");
    const [summary, setSummary] = useState("");
    const [pageTitle, setPageTitle] = useState("");
    const [tabs, setTabs] = useState<{title: string; content: string;}[]>([]);
    const [activeTab, setActiveTab] = useState(tabs[0]);



    useEffect(  () => {

        const fetchData = async () => {
            const useCaseRes = fetch("http://localhost:1337/api/use-cases/" + params.id)
                .then(res => res.json())
                .then((data) => {
                    const useCase = data.data;
                    const uAr: UseCase = {
                        id: useCase.id,
                        title: useCase.attributes.Titel,
                        slug: useCase.attributes.slug,
                        summary: useCase.attributes.Kurzbeschreibung,
                        description: useCase.attributes.Beschreibung,
                        badges: [...useCase.attributes.Tags || []]
                    };

                    setPageTitle(uAr.title);
                    setDescription(uAr.description);
                    setSummary(uAr.summary);
                    setTabs([{title: 'Info', content: uAr.summary }, {title:'Anleitung', content: "asdas"}, {title:'Downloads', content: "hfrtg"}]);
                    setActiveTab(tabs[0]);
                });
        };

        fetchData();

    }, [])


    return (
        <>
            <div className="block rounded bg-white dark:bg-zinc-950 p-4 shadow max-h-full sticky top-0">
                <h2 className={"dark:text-white font-bold text-xl border-solid border-b-4 inline-block mb-2 pr-2 py-1 border-orange-500 capitalize "}>{ pageTitle }</h2>
                <p className={"text-sm text-gray-300 py-4"}> { description }</p>
                <div className={"flex flex-row border-b mb-8 border-gray-300/50"}>
                    {
                        activeTab && tabs.map((tab) =>
                            <Tab key={tab.title} name={tab.title} active={activeTab.title === tab.title} onClick={() => setActiveTab(tab)}/>
                        )
                    }
                </div>
                <div className={"flex flex-row content-stretch gap-12"}>
                    <div>
                        { activeTab && activeTab.content }
                    </div>
                    <div className={"w-5/12 pl-4 border-gray-900/10 border-l-2"}>DU</div>
                </div>
            </div>
        </>
    );
}
