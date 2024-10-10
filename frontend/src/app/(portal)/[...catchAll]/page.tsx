import BlocksRenderer from "@iot-portal/frontend/app/common/BlocksRenderer";
import { fetchAPI } from "@iot-portal/frontend/lib/api";

export default async function Page({params}: { params: { catchAll: string[] } })  {

    const data = (await fetchAPI('/api/pages', {
        fields: '*',
        filters: {
            url: {
                $eq: "/" + params.catchAll.join("/"),
            },
        },
    })).data;

    if(Array.isArray(data) && data.length === 0) {
        throw new Error("page not found");
    }
    const page =  data[0].attributes;

    return  (
                !!page &&
                    <article className={"px-8 py-8"}>
                        <BlocksRenderer content={page.content} className={"*:text-justify"}/>
                    </article>
    );
}
