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
        </div>
    </>);
}
