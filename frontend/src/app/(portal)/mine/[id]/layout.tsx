"use client"
import { Tab } from "@iot-portal/frontend/app/(portal)/usecase/tabs";
import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import TextWithHeadline from "@iot-portal/frontend/app/common/skeletons/textWithHeadline";
import { fetchAPI, getStrapiURL } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import { Suspense} from "react";
import {
    AcademicCapIcon,
    ClockIcon,
    CurrencyEuroIcon,
    CpuChipIcon,
    SignalIcon, PhotoIcon
} from "@heroicons/react/20/solid";
import Status from "@iot-portal/frontend/app/(portal)/deployment-status";


export default async function Layout(props: { children: React.ReactNode, params: {  id: number } }) {


    const useCase: any = await fetchAPI(`/api/thingsboard-plugin/deployment/${props.params.id}`, {},
        {
            headers: {
                Authorization: `Bearer ${Auth.getToken()}`
            }
        });

    return (
        <Suspense> {
            useCase && (
                <>
                    <article
                        className="block rounded bg-white dark:bg-zinc-800 p-6 shadow max-h-full sticky top-0 flex flex-col gap-4">
                        <div className={"flex md:flex-row flex-col gap-8"}>
                            {
                                useCase.thumbnail ? (
                                    <div
                                        className={"w-full md:w-6/12 shrink aspect-video cursor-pointer rounded overflow-hidden not-sr-only"}
                                    >
                                        <GalleryImage thumbnailSrc={getStrapiURL() + useCase.thumbnail.formats.medium.url} src={getStrapiURL() + useCase.thumbnail.url}  alt={""}  caption={useCase.thumbnail.caption}
                                                      className={"relative aspect-video max-w-fit max-h-fit min-w-full min-h-full max-w-full max-h-full object-cover "} aria-hidden={"true"} />
                                    </div>
                                ) : (
                                    <div className={" w-full flex items-center justify-center aspect-video bg-black/20 max-w-[50%] "}><PhotoIcon className={"w-16 h-16 text-black/70"}></PhotoIcon></div>
                                )
                            }
                            <div className={"flex flex-shrink flex-col w-full md:w-6/12"}>
                                <div className={"pr-12 relative"}>
                                    <h1 className={"dark:text-white font-bold text-3xl border-solid border-b-4 inline-block mb-2 pr-2 py-1 border-orange-500 capitalize "}>{useCase.name}</h1>
                                </div>
                                <p className={"text-sm text-gray-600 dark:text-gray-200 py-4 text-justify"}> {useCase.description || "Eine Zusammenfassung wird kurz um ergänzt."}</p>
                            </div>
                            <Status id={props.params.id}></Status>
                        </div>
                        <div className={"pb-8"}>
                            <div className={"flex flex-row border-b mb-8 border-gray-300/50"}>
                                <Suspense>
                                    <Tab name={"Dashboards"} link={"dashboards"}/>
                                </Suspense>
                            </div>
                            <div className={"w-full"}>
                                <Suspense fallback={<TextWithHeadline/>}>
                                    {props.children}
                                </Suspense>
                            </div>
                        </div>
                    </article>

                </>)
        }
        </Suspense>
    );
}
