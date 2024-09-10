import { mapUseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import { fetchAPI, getStrapiURL, getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";

export const dynamic = 'force-dynamic';
export function PictureGallery({ pictures } : {pictures?: any[]}) {

    return (
        <div className={"grid md:grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] grid-cols-2 gap-2"}>
            { pictures && pictures.map((pic, index, allPics) => {
                return (
                        <GalleryImage
                            key={pic.hash} thumbnailSrc={getStrapiURLForFrontend() + pic.formats.thumbnail.url} caption={pic.caption} alt={pic.caption} src={getStrapiURLForFrontend() + pic.url} init={index} imageList={pictures} className={"flex cursor-pointer relative flex-col items-center flex-wrap content-center align-center justify-center truncate w-full aspect-square object-cover absolute max-w-fit max-h-fit min-w-full min-h-full "} />

                );
            })}
        </div>
    );
}

export default async function Bilder({params}: { params: { id: number } }) {

    const qsPara =
        {
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


    return (useCase && <PictureGallery pictures={useCase.pictures}/>);
}
