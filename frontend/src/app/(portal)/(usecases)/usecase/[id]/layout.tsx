import ShareButton from "@iot-portal/frontend/app/(portal)/(usecases)/usecase/[id]/share-button";
import SetupButton from "@iot-portal/frontend/app/(portal)/(usecases)/usecase/setup-button";
import { Tab } from "@iot-portal/frontend/app/(portal)/(usecases)/usecase/tabs";
import BaseBody from "@iot-portal/frontend/app/common/baseBody";
import BaseLayout from "@iot-portal/frontend/app/common/baseLayout";
import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import Loading from "@iot-portal/frontend/app/common/loading";
import TextWithHeadline from "@iot-portal/frontend/app/common/skeletons/textWithHeadline";
import { fetchAPI, getStrapiURL, getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";
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

export const dynamic = 'force-dynamic';
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

    const useCase: UseCase | undefined = await fetchAPI('/api/use-cases', qsPara).then((data) => {
        return mapUseCase(data.data[0] || undefined);
    });


    const pageQsPara =
        {
            fields: '*',
            populate: '*'
        }
    ;

    const pageData = (await fetchAPI('/api/portal-einstellungen', pageQsPara)).data;
    const page = pageData && pageData.attributes || null;

    return useCase && page ? {
        title: page.title + " - " + useCase.title,
        openGraph: {
            images: [(useCase.thumbnail?.formats?.medium?.url || useCase.thumbnail?.url) && (getStrapiURL() + (useCase.thumbnail?.formats?.medium?.url || useCase.thumbnail?.url))],
            title: page.title + " - " + useCase.title,
            type: 'website',
            description: useCase.summary
        },
        twitter: {
            card: 'summary_large_image',
            title: page.title + " - " + useCase.title,
            description: useCase.summary,
            images: [(useCase.thumbnail?.formats?.medium?.url || useCase.thumbnail?.url) && (getStrapiURL() + (useCase.thumbnail?.formats?.medium?.url || useCase.thumbnail?.url))],
        }
    } : {};
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
                setupSteps: true
            },
            filters: {
                slug: {
                    $eq: props.params.id,
                },
            },
        }
    ;

    const useCase: UseCase | undefined = await fetchAPI('/api/use-cases', qsPara).then((data) => {
        return mapUseCase(data.data[0] || undefined);
    });

    return (
        <Suspense> {
        useCase && (
            <BaseBody>
                <article
                    className="block rounded bg-white dark:bg-zinc-900 p-6 shadow max-h-full sticky top-0 flex flex-col gap-4">
                    <div className={"flex md:flex-row flex-col gap-8"}>
                        {
                            useCase.thumbnail?.formats?.medium?.url || useCase.thumbnail?.url ? (
                                <div
                                    className={" w-full md:w-6/12 shrink aspect-video cursor-pointer rounded overflow-hidden not-sr-only"}
                                >
                                    <GalleryImage thumbnailSrc={getStrapiURLForFrontend() + (useCase.thumbnail?.formats?.medium?.url || useCase.thumbnail.url) } src={getStrapiURLForFrontend() + useCase.thumbnail.url}  alt={""}  caption={useCase.thumbnail.caption}
                                                  className={"relative aspect-video max-w-fit max-h-fit min-w-full min-h-full max-w-full max-h-full object-cover "} aria-hidden={"true"} />
                                </div>
                            ) : (
                                <div className={" flex items-center justify-center aspect-video bg-black/20  w-full md:w-6/12 "}><PhotoIcon className={"w-16 h-16 text-black/70"}></PhotoIcon></div>
                            )
                        }
                        <div className={"flex flex-shrink flex-col w-full md:w-6/12 min-w-6/12 gap-4"}>
                            <div className={"pr-14 relative"}>
                                <ShareButton className={"absolute top-0 right-0 block w-10 h-10 p-1 flex-shrink-0 flex-grow-0 aspect-square"} shareData={{
                                    title: (await generateMetadata({params: props.params})).title || "",
                                    text: "Das sieht interessant aus!",
                                    url: 'https://portal.iot4h.de/usecase/'+ props.params.id,
                                }}></ShareButton>
                                <div className={"inline-block   " +
                                    "block w-min border-solid border-b-4 pr-2 border-orange-500  text-pretty break-words hyphens-auto"}><h1 className={"dark:text-white font-bold text-3xl capitalize  w-max"}>{useCase.title} test t a23 asd asd asd asd d</h1></div>
                            </div>
                            <div className="flex flex-row gap-2 flex-wrap text-orange-500 empty:hidden">
                                {
                                    [...useCase.devices.map((i: any) => {
                                        return i.device.data && i.device.data.attributes.name;
                                    }), ...useCase.tags].sort().map(b => (<Badge key={b} name={b}/>))
                                }
                            </div>
                            <p className={"text-sm text-gray-600 dark:text-gray-200 text-justify break-words hyphens-auto"}> {useCase.summary || "Eine Zusammenfassung wird kurz um ergänzt."}</p>
                            <div className={"flex flex-row justify-evenly gap-8 mt-auto"}>
                                { useCase.devices.length > 0 && <div className={"text-xs flex flex-col items-center gap-2 text-center"}
                                     title={"Sensoren"}>
                                    <SignalIcon className={"w-8"}/>
                                     2{useCase.devices
                                        .filter((i) => i.device.data.attributes.type == 'sensor')
                                        .map((i) => {
                                            return i.amount;
                                        }).reduce((pv, c) => {
                                            return pv + c;
                                        }, 0)
                                    }<span className={"sr-only"}>Sensoren werden gebraucht.</span>
                                </div> }
                                { useCase.devices.length > 0 && <div className={"text-xs flex flex-col items-center gap-2  text-center"}
                                     title={"Microcontroller"}>
                                    <CpuChipIcon className={"w-8"}/>
                                    3{ useCase.devices
                                        .filter((i) => i.device.data.attributes.type == 'microcontroller')
                                        .map((i) => {
                                            return i.amount;
                                        }).reduce((pv, c) => {
                                            return pv + c;
                                        }, 0)
                                    }
                                </div>}
                                { !!useCase.costs && <div className={"text-xs flex flex-col items-center gap-2  text-center"}
                                     title={"Kosten"}>
                                    <CurrencyEuroIcon className={"w-8"}/>
                                    <span>{useCase.costs}€</span>
                                </div> }
                                { !!useCase.setupDuration && <div className={"text-xs flex flex-col items-center gap-2  text-center"}
                                     title={"Aufbaudauer"}>
                                    <ClockIcon className={"w-8"}/>
                                    <span>{useCase.setupDuration} min</span>
                                </div> }
                                { !!useCase.complexity && <div className={"text-xs flex flex-col items-center gap-2  text-center"}
                                     title={"Schwierigkeit"}>
                                    <AcademicCapIcon className={"w-8"}/>
                                    <span>Level {useCase.complexity}</span>
                                </div> }
                            </div>
                            <Suspense fallback={<Loading />}>
                                <SetupButton slug={useCase.slug}></SetupButton>
                            </Suspense>
                        </div>
                    </div>
                    <div className={"pb-8"}>
                        <div className={"flex flex-row border-b mb-8 border-gray-300/50"}>
                            <Suspense>
                                <Tab name={"Info"} link={`/usecase/${props.params.id}/`}/>
                                {/*<Tab name={"Bilder"} link={`/usecase/${params.id}/bilder/`}/>*/}
                                { useCase.setupSteps.length > 0  && <Tab name={"Anleitung"} link={`/usecase/${props.params.id}/instructions/`}/> }
                            </Suspense>
                        </div>
                        <div className={"w-full"}>
                            <Suspense fallback={<TextWithHeadline/>}>
                                {props.children}
                            </Suspense>
                        </div>
                    </div>
                </article>

            </BaseBody>)
        }
        </Suspense>
    );
}
