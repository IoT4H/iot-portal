import { mapUseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import CustomMarkdown from "@iot-portal/frontend/app/common/CustomMarkdown";
import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import { fetchAPI, getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";

function Info({ description } : { description: string; }) {
    return (<CustomMarkdown className={"markdown mx-8 text-justify"}>{description}</CustomMarkdown>);
}

function PictureGallery({ pictures } : {pictures?: any[]}) {

    return (
        <div className={"grid md:grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] grid-cols-2 gap-2"}>
            { pictures && pictures.map((pic, index, allPics) => {
                return (
                    <GalleryImage key={pic.hash} thumbnailSrc={getStrapiURLForFrontend(pic.formats.thumbnail.url)} caption={pic.caption} alt={pic.caption} src={getStrapiURLForFrontend(pic.url)} init={index} imageList={pictures} className={"flex cursor-pointer relative flex-col items-center flex-wrap content-center align-center justify-center truncate w-full aspect-square object-cover absolute max-w-fit max-h-fit min-w-full min-h-full "} />
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
        <div className={"mt-4 mx-8 "}>
            <PictureGallery pictures={useCase.pictures}/>
            { Array.isArray(useCase.partnerLogos) && useCase.partnerLogos.length > 0 && <>
                <span className={"block mt-8 mb-4"}>Vorgestellt durch: </span>
                <div className="flex flex-row gap-2 flex-wrap w-full flex-grow-0">
                    {
                        useCase.partnerLogos.map((pL) => (
                            <img className={"h-12 object-center object-contain"} key={pL.hash} src={getStrapiURLForFrontend(pL.formats?.small?.url || pL.url)} alt={pL.alternativeText}/>
                        ))
                    }
                </div>
            </> }
        </div>
    </>);
}
