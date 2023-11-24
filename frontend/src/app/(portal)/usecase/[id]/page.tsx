import { mapUseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import ReactMarkdown from "react-markdown";

function Info({ description } : { description: string; }) {
    return (<ReactMarkdown components={
        {
            h1: "h2",
            h2: "h3",
            h3: "h4",
            h4: "h5",
            h5: "h5",
            h6: "b",
            img(props) {
            const {node, ...rest} = props;

            if(!rest.src) {
                return null;
            }
            const thumbnail = rest.src.replace("/uploads/", "/uploads/thumbnail_")

            return  <GalleryImage  {...rest} init={0} imageList={[rest.src]} src={thumbnail} className={"h-[12em]"}/>;
            }
        }
    } className={"markdown mx-8 text-justify"}>{description}</ReactMarkdown>);
}


export default async function UseCasePage({params}: { params: { id: number } }) {


    const qsPara =
        {
            fields: [ 'description' ],
            filters: {
                slug: {
                    $eq: params.id,
                },
            },
        }
    ;

    const useCase = await fetchAPI('/use-cases', qsPara).then((data) => {
        return mapUseCase(data.data[0]);
    });


    return (<Info description={useCase.description}/>);
}
