import { mapUseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import ReactMarkdown from "react-markdown";

function Info({ description } : { description: string; }) {
    return (<ReactMarkdown className={"markdown mx-8 text-justify"}>{description}</ReactMarkdown>);
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
