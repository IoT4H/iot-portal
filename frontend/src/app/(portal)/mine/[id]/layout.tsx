"use client"
import { CursorArrowRaysIcon } from "@heroicons/react/24/solid";
import { Tab } from "@iot-portal/frontend/app/(portal)/usecase/tabs";
import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import { LoadingState } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import TextWithHeadline from "@iot-portal/frontend/app/common/skeletons/textWithHeadline";
import { fetchAPI, getStrapiURL, getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import { usePathname } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import {
    PhotoIcon, WrenchScrewdriverIcon
} from "@heroicons/react/20/solid";
import Status from "@iot-portal/frontend/app/(portal)/deployment-status";

export const dynamic = 'force-dynamic';

export default function Layout(props: { children: React.ReactNode, params: {  id: number } }) {


    const [setup, SetSetup] = useState<any>();

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


    return (
        <>
        <Suspense> {
            setup && (
                <>
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
                </>)


        }

        </Suspense>
    </>
    );
}
