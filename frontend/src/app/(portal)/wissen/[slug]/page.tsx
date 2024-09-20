import { PhotoIcon } from "@heroicons/react/20/solid";
import { mapUseCase, UseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import BlocksRenderer from "@iot-portal/frontend/app/common/BlocksRenderer";
import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import { fetchAPI, getStrapiURL, getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";


export const dynamic = 'force-dynamic';


export async function generateMetadata({ params }: {params: Params}) {

    const qsPara =
        {
            fields: '*',
            populate: {
                thumbnail: {
                    populate: '*',
                }
            },
            filters: {
                slug: {
                    $eq: params.slug,
                },
            },
        }
    ;

    const word: any | undefined = await fetchAPI('/api/glossars', qsPara).then((data) => {
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

    return word && page ? {
        title: page.title + " - " + word.word,
        openGraph: {
            images: [word.thumbnail && (getStrapiURL(word.thumbnail?.data.attributes.formats?.medium?.url || word.thumbnail?.data.attributes.url))],
            title: page.title + " - " + word.word,
            type: 'website',
            description: word.shortdescription
        },
        twitter: {
            card: 'summary_large_image',
            title: page.title + " - " + word.word,
            description: page.shortdescription,
            images: [word.thumbnail && (getStrapiURL(word.thumbnail?.data?.attributes?.formats?.medium?.url || word.thumbnail?.data?.attributes?.url))],
        }
    } : {};
}

export default async function Page({params}: { params: { slug: string } })  {

    const data = (await fetchAPI('/api/glossars', {
        fields: '*',
        populate: {
            thumbnail: {
                populate: true
            }
        },
        filters: {
            slug: {
                $eq: params.slug,
            },
        },
    })).data;

    const page = Array.isArray(data) && data.length > 0 ? data[0].attributes : { word: "",shortdescription: "", text: []};

    return  (
                !!page &&
                    <article>
                        <div className={"flex md:flex-row flex-col gap-8"}>
                            <div>
                                <div className={"flex flex-col h-full"}>
                                    <h2 className={"dark:text-white font-bold text-3xl border-solid border-b-4 inline-block mb-2 pr-2 mt-[1em] border-orange-500 flex-grow-0 inline-block w-max"}>{page.word}</h2>
                                    <p className={"my-auto text-gray-700 dark:text-gray-100 flex-grow py-2"}>{page.shortdescription}</p>
                                    <div className={"w-8 rounded h-[2px] bg-orange-500/50 mx-auto mt-auto flex-grow-0"}></div>
                                </div>
                            </div>
                            {
                                page.thumbnail?.formats?.url ? (
                                    <div
                                        className={" w-full md:w-6/12 min-w-6/12 shrink aspect-video cursor-pointer rounded overflow-hidden not-sr-only"}
                                    >
                                        <GalleryImage thumbnailSrc={getStrapiURLForFrontend(page.thumbnail?.formats?.medium?.url || page.thumbnail.url)} src={getStrapiURLForFrontend(page.thumbnail.url)}  alt={""}  caption={page.thumbnail.caption}
                                                      className={"relative aspect-video max-w-fit max-h-fit min-w-full min-h-full max-w-full max-h-full object-cover "} aria-hidden={"true"} />
                                    </div>
                                ) : (
                                    <div className={" flex items-center justify-center aspect-video bg-black/20  w-full md:w-6/12 min-w-6/12 "}><PhotoIcon className={"w-16 h-16 text-black/70"}></PhotoIcon></div>
                                )
                            }
                        </div>
                        <BlocksRenderer content={page.text} className={"*:text-justify mt-8"}/>
                    </article>
    );
}
