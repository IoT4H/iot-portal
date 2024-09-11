import BlocksRenderer from "@iot-portal/frontend/app/common/BlocksRenderer";
import { fetchAPI } from "@iot-portal/frontend/lib/api";

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
                        <div className={"text-center"}>
                            <h2 className={"dark:text-white font-bold text-3xl border-solid border-b-4 inline-block mb-2 pr-2 mx-auto mt-[1em] px-1 border-orange-500"}>{ page.word }</h2>
                        </div>
                        <div className={"text-center"}>
                            <p className={"peer mt-8 text-gray-100"}>{ page.shortdescription }</p>
                            <div className={"w-8 rounded h-[2px] bg-orange-500/50 mx-auto my-8 peer-empty:hidden"}></div>
                        </div>
                        <BlocksRenderer content={page.text} className={"*:text-justify"}/>
                    </article>
    );
}
