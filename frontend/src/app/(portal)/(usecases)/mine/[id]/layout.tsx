"use client"
import { PhotoIcon } from "@heroicons/react/20/solid";
import { CursorArrowRaysIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Tab } from "@iot-portal/frontend/app/(portal)/(usecases)/usecase/tabs";
import Status from "@iot-portal/frontend/app/(portal)/deployment-status";
import BaseBody from "@iot-portal/frontend/app/common/baseBody";
import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import { LoadingState } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import { Prompt, PromptType } from "@iot-portal/frontend/app/common/prompt";
import { fetchAPI, getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useReducer, useState } from "react";

export const dynamic = 'force-dynamic';

export default function Layout(props: { children: React.ReactNode, params: {  id: number } }) {


    const [setup, SetSetup] = useState<any>();

    const router = useRouter();

    const pathname = usePathname()

    useEffect(() => {
        LoadingState.startLoading();
        fetchAPI(`/api/thingsboard-plugin/deployment/${props.params.id}`, {},
            {
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                }
            }).then((respond) => {
                SetSetup(respond);

                fetchAPI(`/api/thingsboard-plugin/deployment/${props.params.id}/steps/progressComplete`, {},
                    {
                        headers: {
                            Authorization: `Bearer ${Auth.getToken()}`
                        }
                    }).then((response) => {
                    if(response !== null && response.complete) {
                        SetSetupDevice(false);
                    } else {
                        SetSetupDevice(true);
                    }
                })
            });
    }, []);


    useEffect(() => {
        fetchAPI(`/api/thingsboard-plugin/deployment/${props.params.id}/steps/progressComplete`, {},
            {
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                }
            }).then((response) => {
            if(response.complete) {
                SetSetupDevice(false);
            } else {
                SetSetupDevice(true);
            }
        })
    }, [pathname]);


    const [setupDevice, SetSetupDevice] = useState<boolean | undefined>(undefined);


    const [deletePrompt, toggleDeletePrompt] = useReducer(prevState => !prevState, false);

    const deleteUseCase = useCallback(() => {
            LoadingState.startLoading();
            fetchAPI(`/api/deployments/${props.params.id}`, { }, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                }
            }).then((respond) => {
                router.push("/mine/");
            }).finally(() => {
                LoadingState.endLoading();
            })
    }, []);


    return (
        <>
        <Suspense> {
            setup && (
                <BaseBody>
                    <article
                        className="block rounded bg-white dark:bg-zinc-800 p-6 shadow max-h-full sticky top-0 flex flex-col gap-4">
                        <div className={"flex md:flex-row flex-col gap-8"}>
                            {
                                setup.thumbnail ? (
                                    <div
                                        className={"w-full md:w-6/12 shrink aspect-video cursor-pointer rounded overflow-hidden not-sr-only"}
                                    >
                                        <GalleryImage thumbnailSrc={getStrapiURLForFrontend() + setup.thumbnail.formats.medium.url} src={getStrapiURLForFrontend() + setup.thumbnail.url}  alt={""}  caption={setup.thumbnail.caption}
                                                      className={"relative aspect-video max-w-fit max-h-fit min-w-full min-h-full max-w-full max-h-full object-cover "} aria-hidden={"true"} />
                                    </div>
                                ) : (
                                    <div className={"flex items-center justify-center aspect-video bg-black/20 w-full md:w-6/12 "}><PhotoIcon className={"w-16 h-16 text-black/70"}></PhotoIcon></div>
                                )
                            }
                            <div className={"flex flex-shrink flex-col w-full md:w-6/12"}>
                                <div className={"w-full relative pr-[10.5rem]"}>
                                    <div className={"absolute top-2 right-0 "}>
                                        <Status id={props.params.id}></Status>
                                    </div>
                                    <div className={"block border-solid border-b-4 pr-2 border-orange-500 "}><h1
                                        className={"dark:text-white font-bold text-3xl capitalize text-pretty break-words hyphens-auto"}>{setup.name}</h1>
                                    </div>
                                </div>
                                <p className={"text-sm text-gray-600 dark:text-gray-200 py-4 flex-grow text-justify"}> {setup.description || "Eine Zusammenfassung wird kurz um ergänzt."}</p>
                            </div>
                        </div>
                        <div className={"pb-8"}>
                            <div className={"flex flex-row border-b mb-8 border-gray-300/50"}>
                                <Suspense>
                                    { setupDevice == true && <div className={"text-orange-500 font-extrabold text-xl leading-4"}>
                                         <Tab name={"Start"} link={`/mine/${props.params.id}/start/`} Icon={CursorArrowRaysIcon}/>
                                    </div> }
                                </Suspense>
                                <Suspense>
                                    { setupDevice == false && <Tab name={"Dashboards"} link={`/mine/${props.params.id}/dashboards/`}/> }
                                </Suspense>
                                <Suspense>
                                    { setupDevice == false && <Tab name={"Geräte & Sensoren"} link={`/mine/${props.params.id}/devices/`}/> }
                                </Suspense>
                                <Tab name={""} Icon={TrashIcon} className={"ml-auto bg-red-500/40 hover:border-b-transparent"} onClick={() => toggleDeletePrompt()}/>
                                { deletePrompt && <Prompt type={PromptType.Warning} text={<>Diese Aktion ist unwiderruflich. Dabei werden alle Verknüpften Daten aus Ihrem Anwendungsfall <b>&quot; {setup.name} &quot;</b> gelöscht. Sind Sie sich sicher, dass Sie <b>&quot; {setup.name} &quot;</b> löschen wollen? </>} actions={[{text: "Löschen", actionFunction: () => deleteUseCase(), className: "bg-red-500 text-white", Icon: TrashIcon}, { text: "Abbruch", className: "bg-gray-400 ", actionFunction: () => {}}]} onClose={() => toggleDeletePrompt()} />}
                            </div>
                            <div className={"w-full"}>
                                {
                                    props.children
                                }
                            </div>
                        </div>
                    </article>

                    {
                        LoadingState.endLoading()
                    }
                </BaseBody>)


        }

        </Suspense>
    </>
    );
}
