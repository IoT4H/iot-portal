import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import TextWithHeadline from "@iot-portal/frontend/app/common/skeletons/textWithHeadline";
import { fetchAPI, getStrapiURL } from "@iot-portal/frontend/lib/api";
import { Suspense } from "react";
import Blocks, { RenderFn } from 'editorjs-blocks-react-renderer';

export default async function Page({params}: { params: any & { catchAll: string } }) {

    const l: string = params.catchAll.join("/");

    const qsPara =
        {
            fields: '*',
            filters: {
                url: {
                    $eq: l,
                },
            },
        }
    ;

    const page = await (fetchAPI('/pages', qsPara)).then((result) => {
        return JSON.parse(result.data[0].attributes.content);
    });

    const config = {
        header: {
            className: "first-of-type:text-3xl first-of-type:capitalize first-of-type:border-b-4 first-of-type:py-1 first-of-type:mb-4 first-of-type:font-bold first-of-type:px-2 first-of-type:text-center my-2 border-solid text-xl border-orange-500 inline-block"
        }
    };

    const ImageFn: RenderFn<{
        items: string[]
    }> = (props) => {
console.log(props)
        return (
            <>/*
                <figure className={"y-2"}>
                    <GalleryImage src={getStrapiURL() + props.data.file.url} className={props.data.stretched === true ? "relative -left-16 max-w-[calc(100%_+_8rem)]" : "" }/>
                    <caption className={"mt-2 block center"}>{props.data.caption }</caption>
                </figure>*/
            </>
        )
    }

    return (
        <>
            <article
                className="block rounded bg-white dark:bg-zinc-800 p-8 px-16 text-justify shadow max-h-full sticky top-0">
                <Suspense fallback={<TextWithHeadline/>}>
                    { page ? <Blocks data={page} config={config} renderers={{image: ImageFn}}/> : null }
                </Suspense>
            </article>

        </>
    );

}
