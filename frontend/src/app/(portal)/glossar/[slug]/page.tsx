"use client"
import BlocksRenderer from "@iot-portal/frontend/app/common/BlocksRenderer";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Suspense, useEffect, useState } from "react";



export default function Page({params}: { params: { slug: string } })  {

    const [page, SetPage] = useState<any>();


    useEffect(() => {
        fetchAPI('/api/glossars', {
            fields: '*',
            filters: {
                slug: {
                    $eq: params.slug,
                },
            },
        }).then((result) => {
            if (Array.isArray(result.data) && result.data.length > 0) {
                SetPage(result.data[0].attributes);
            } else {
                SetPage({ word: "",shortdescription: "", text: []});
            }

        });
    }, [params.slug]);

    useEffect(() => {
        if(page && page.data && page.data.length > 0) {
            console.log(page.data[0].attributes)
        }
    }, [page])

    return  (
        <Suspense>
            {
                !!page &&
                    <article className={"px-8"}>
                        <div className={"text-center"}>
                            <h2 className={"dark:text-white font-bold text-3xl border-solid border-b-4 inline-block mb-2 pr-2 mx-auto mt-[1em] px-1 border-orange-500"}>{ page.word }</h2>
                        </div>
                        <div className={"text-center"}>
                            <p className={"peer mt-8 text-gray-100"}>{ page.shortdescription }</p>
                            <div className={"w-8 rounded h-[2px] bg-gray-100/30 mx-auto my-8 peer-empty:hidden"}></div>
                        </div>
                        <BlocksRenderer content={page.text} />
                    </article>
            }
        </Suspense>
    );
}
