import { PhotoIcon } from "@heroicons/react/20/solid";
import BlocksRenderer from "@iot-portal/frontend/app/common/BlocksRenderer";
import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import { fetchAPI, getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";

export default async function Page({params}: { params: { slug: string } })  {

    const data = (await fetchAPI('/api/glossars', {
        fields: '*',
        filters: {
            slug: {
                $eq: params.slug,
            },
        },
    })).data;

    const page = Array.isArray(data) && data.length > 0 ? data[0].attributes : { word: "",shortdescription: "", text: []};

    return  (
                !!page &&
                    <article className={"px-8"}>
                        <div className={"flex md:flex-row flex-col gap-8"}>
                            <div>
                                <div className={"flex flex-col h-full"}>
                                    <h2 className={"dark:text-white font-bold text-3xl border-solid border-b-4 inline-block mb-2 pr-2 mt-[1em] border-orange-500 flex-grow-0"}>{page.word}</h2>
                                    <p className={"my-auto text-gray-100 flex-grow py-2"}>{page.shortdescription}</p>
                                    <div className={"w-8 rounded h-[2px] bg-orange-500/50 mx-auto mt-auto flex-grow-0"}></div>
                                </div>
                            </div>
                            {
                                page.thumbnail && !!page.thumbnail.url && page.thumbnail.formats && page.thumbnail.formats.medium && !!page.thumbnail.formats.medium.url ? (
                                    <div
                                        className={" w-full md:w-6/12 min-w-6/12 shrink aspect-video cursor-pointer rounded overflow-hidden not-sr-only"}
                                    >
                                        <GalleryImage thumbnailSrc={getStrapiURLForFrontend() + page.thumbnail.formats.medium.url } src={getStrapiURLForFrontend() + page.thumbnail.url}  alt={""}  caption={page.thumbnail.caption}
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
