import ShareButton from "@iot-portal/frontend/app/(portal)/usecase/[id]/share-button";
import SetupButton from "@iot-portal/frontend/app/(portal)/usecase/setup-button";
import Tabs from "@iot-portal/frontend/app/(portal)/usecase/tabs";
import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import Loading from "@iot-portal/frontend/app/common/loading";
import TextWithHeadline from "@iot-portal/frontend/app/common/skeletons/textWithHeadline";
import { fetchAPI, getStrapiURL } from "@iot-portal/frontend/lib/api";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { Suspense} from "react";
import { Badge, mapUseCase, UseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import {
    AcademicCapIcon,
    ClockIcon,
    CurrencyEuroIcon,
    CpuChipIcon,
    SignalIcon, PhotoIcon
} from "@heroicons/react/20/solid";

export async function generateMetadata({ params }: {params: Params}) {

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
                    device: {
                        populate: "*"
                    }
                },
            },
            filters: {
                slug: {
                    $eq: params.id,
                },
            },
        }
    ;

    const useCase: UseCase = await fetchAPI('/api/use-cases', qsPara).then((data) => {
        return mapUseCase(data.data[0]);
    });


    const pageQsPara =
        {
            fields: '*',
            populate: '*'
        }
    ;

    const page = (await fetchAPI('/api/portal-einstellungen', pageQsPara)).data.attributes || null;

    return {
        title: page.title + " - " + useCase.title,
        openGraph: {
            images: [useCase.thumbnail && (getStrapiURL() + useCase.thumbnail.formats.medium.url)],
            url: 'https://portal.iot4h.de/usecase/'+ params.id,
            title: page.title + " - " + useCase.title,
            type: 'website',
            description: useCase.summary
        },
        twitter: {
            card: 'summary_large_image',
            title: page.title,
            description: page.description,
            images: [useCase.thumbnail && (getStrapiURL() + useCase.thumbnail.formats.medium.url)],
        }
    }
}

export default async function UseCase(props: { children: React.ReactNode, params: {  id: number } }) {

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
                    device: {
                        populate: "*"
                    }
                },
            },
            filters: {
                slug: {
                    $eq: props.params.id,
                },
            },
        }
    ;

    const useCase: UseCase = await fetchAPI('/api/use-cases', qsPara).then((data) => {
        return mapUseCase(data.data[0]);
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
                                    className={" w-full md:w-6/12 min-w-6/12 shrink aspect-video cursor-pointer rounded overflow-hidden not-sr-only"}
                                >
                                    <GalleryImage thumbnailSrc={getStrapiURL() + useCase.thumbnail.formats.medium.url} src={getStrapiURL() + useCase.thumbnail.url}  alt={""}  caption={useCase.thumbnail.caption}
                                                  className={"relative aspect-video max-w-fit max-h-fit min-w-full min-h-full max-w-full max-h-full object-cover "} aria-hidden={"true"} />
                                </div>
                            ) : (
                                <div className={" flex items-center justify-center aspect-video bg-black/20  w-full md:w-6/12 min-w-6/12 "}><PhotoIcon className={"w-16 h-16 text-black/70"}></PhotoIcon></div>
                            )
                        }
                        <div className={"flex flex-shrink flex-col w-full md:w-6/12 min-w-6/12"}>
                            <div className={"pr-12 relative"}>
                                <ShareButton className={"absolute top-2 right-2 w-8 aspect-square"} shareData={{
                                    title: (await generateMetadata({params: props.params})).title,
                                    text: "Das sieht interessant aus!",
                                    url: 'https://portal.iot4h.de/usecase/'+ props.params.id,
                                }}></ShareButton>
                                <h1 className={"dark:text-white font-bold text-3xl border-solid border-b-4 inline-block mb-2 pr-2 py-1 border-orange-500 capitalize "}>{useCase.title}</h1>
                            </div>
                            <div className="flex flex-row gap-2 mt-4 flex-wrap text-orange-500">
                                {
                                    [...useCase.devices.map((i: any) => {
                                        return i.device.data && i.device.data.attributes.name;
                                    }), ...useCase.tags].sort().map(b => (<Badge key={b} name={b}/>))
                                }
                            </div>
                            <p className={"text-sm text-gray-600 dark:text-gray-200 py-4 text-justify"}> {useCase.summary || "Eine Zusammenfassung wird kurz um ergänzt."}</p>
                            <div className={"flex flex-row justify-evenly gap-8 my-4 mt-auto"}>
                                <div className={"text-xs flex flex-col items-center gap-2 text-center"}
                                     title={"Sensoren"}>
                                    <SignalIcon className={"w-8"}/>
                                     {useCase.devices
                                        .filter((i) => i.device.data.attributes.type == 'sensor')
                                        .map((i) => {
                                            return i.amount;
                                        }).reduce((pv, c) => {
                                            return pv + c;
                                        }, 0)
                                    }<span className={"sr-only"}>Sensoren werden gebraucht.</span>
                                </div>
                                <div className={"text-xs flex flex-col items-center gap-2  text-center"}
                                     title={"Microcontroller"}>
                                    <CpuChipIcon className={"w-8"}/>
                                    {useCase.devices
                                        .filter((i) => i.device.data.attributes.type == 'microcontroller')
                                        .map((i) => {
                                            return i.amount;
                                        }).reduce((pv, c) => {
                                            return pv + c;
                                        }, 0)
                                    }
                                </div>
                                <div className={"text-xs flex flex-col items-center gap-2  text-center"}
                                     title={"Kosten"}>
                                    <CurrencyEuroIcon className={"w-8"}/>
                                    {useCase.costs}€
                                </div>
                                <div className={"text-xs flex flex-col items-center gap-2  text-center"}
                                     title={"Aufbaudauer"}>
                                    <ClockIcon className={"w-8"}/>
                                    {useCase.setupDuration}min
                                </div>
                                <div className={"text-xs flex flex-col items-center gap-2  text-center"}
                                     title={"Schwierigkeit"}>
                                    <AcademicCapIcon className={"w-8"}/>
                                    Level {useCase.complexity}
                                </div>
                            </div>
                            <Suspense fallback={<Loading />}>
                                <SetupButton slug={useCase.slug}></SetupButton>
                            </Suspense>
                        </div>
                    </div>
                    <div className={"pb-8"}>
                        <div className={"flex flex-row border-b mb-8 border-gray-300/50"}>
                            <Suspense>
                                <Tabs/>
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
