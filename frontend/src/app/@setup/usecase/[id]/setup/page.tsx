"use client"
import { mapUseCase, UseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import { ModalUI } from "@iot-portal/frontend/app/common/modal";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { useState, useEffect } from "react";
import { InformationCircleIcon } from "@heroicons/react/16/solid";
import { Auth } from "@iot-portal/frontend/lib/auth";
export default function Start({params}: { params: { id: number } }) {

    const [title, setTitle] = useState<string>();
    const [description, setDescription] = useState<string>();

    const [useCase, SetUseCase] = useState<UseCase>();


    useEffect(() => {
        fetchAPI('/api/use-cases', {
            filters: {
                slug: {
                    $eq: params.id,
                },
            },
        }).then((data) => {
            const u = mapUseCase(data.data[0]);
            SetUseCase(u);
            setTitle(u.title);
            setDescription(u.summary);
        });
    }, [params.id])



    const setupStart = () => {
        useCase && fetchAPI(`/api/thingsboard-plugin/usecase/${useCase.id}/setup/deploy`, { title: title, description: description }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Auth.getToken()}`
            }
        }).then((data) => {
            console.log(data);
        })
    }


    return (
        <ModalUI>
            <div className={"max-w-3xl w-[75vw]"}>
                <h1 className={"w-full mr-8 text-2xl font-bold"}>Setup Einrichten</h1>
                <form onSubmit={(e) =>{ e.preventDefault(); setupStart(); }}>
                    <label htmlFor={"title"} className={"block text-xl mt-8 flex flex-row items-center gap-1"}>Title <InformationCircleIcon title={"Titel um das Setup wieder zu erkennen"} className={"inline-block align-center h-4 w-4"}></InformationCircleIcon></label>
                    <input id={"title"} name="title"
                           className={"mt-2 bg-stone-800/10 rounded-md border-black/10 border-1 w-full text-white focus:ring-white focus:border-black/10 "} value={title} onChange={(event)=> { setTitle(event.target.value);}} autoFocus />
                    <label htmlFor={"description"} className={"block text-xl mt-8 flex flex-row items-center gap-1"}>Beschreibung <InformationCircleIcon title={"Kurze Beschreibung für den Verwendungszweck"} className={"inline-block align-center h-4 w-4"}></InformationCircleIcon></label>
                    <textarea name="description"
                              className={"mt-2 bg-stone-800/10 rounded-md border-black/10 border-1 w-full text-white focus:ring-white focus:border-black/10 h-64 resize-none"} value={description} onChange={(event)=> { setDescription(event.target.value);}}></textarea>
                    <button
                        className={"mt-4 cursor-pointer w-full text-center rounded-md ml-auto bg-orange-500/80 hover:bg-orange-500 text-white flex-row flex gap-4 justify-center items-center uppercase mx-4 px-4 py-4"}>Starten
                    </button>
                </form>
            </div>
        </ModalUI>
    )
}
