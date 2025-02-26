import CustomMarkdown from "@iot-portal/frontend/app/common/CustomMarkdown";
import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import { mapUseCase } from "@iot-portal/frontend/app/common/mappingFunctions";
import { fetchAPI, getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";
import * as React from "react";

function Info({ description } : { description: string; }) {
    return (<CustomMarkdown className={"markdown mx-8 text-justify"}>{description}</CustomMarkdown>);
}

function PictureGallery({ pictures } : {pictures?: any[]}) {

    return (
        <div className={"grid md:grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] grid-cols-2 gap-2"}>
            { pictures && pictures.map((pic, index, allPics) => {
                return (
                    <GalleryImage key={pic.hash} thumbnailSrc={getStrapiURLForFrontend(pic.formats.thumbnail.url)} caption={pic.caption} alt={pic.alternativeText}  src={getStrapiURLForFrontend(pic.url)} init={index} imageList={pictures} className={"flex cursor-pointer relative flex-col items-center flex-wrap content-center align-center justify-center truncate w-full aspect-square object-cover absolute max-w-fit max-h-fit min-w-full min-h-full "} />
                );
            })}
        </div>
    );
}

export const dynamic = 'force-dynamic';
export default async function UseCasePage({params}: { params: { id: number } }) {


    const qsPara =
        {
            fields: [ 'description' ],
            populate: {
                pictures: {
                    populate: '*',
                },
                partnerLogos: {
                    populate: '*',
                }
            },
            filters: {
                slug: {
                    $eq: params.id,
                },
            },
        }
    ;

    const useCase = await fetchAPI('/api/use-cases', qsPara).then((data) => {
        return mapUseCase(data.data[0]);
    });


    return (<>
        <Info description={useCase.description}/>
        <div className={"mt-8 mx-8 flex flex-col gap-8"}>
            <PictureGallery pictures={useCase.pictures}/>
            { Array.isArray(useCase.partnerLogos) && useCase.partnerLogos.length > 0 &&
                <div className={"rounded  text-black"}>
                     <h3 className="dark:text-white font-bold text-xl  border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]">Vorgestellt durch:</h3>
                    <div className="flex flex-row gap-4 flex-wrap w-full flex-grow-0 mt-4">
                        {
                            useCase.partnerLogos.map((pL) => (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <GalleryImage className={"w-40 object-center object-contain py-2 px-4 bg-white rounded "} key={pL.hash}
                                     src={getStrapiURLForFrontend(pL.formats?.small?.url || pL.url)}
                                     alt={pL.alternativeText}/>
                            ))
                        }
                    </div>
                </div>}
        </div>
    </>);
}
