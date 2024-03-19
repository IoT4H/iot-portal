import { ArrowTopRightOnSquareIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import { fetchAPI, getStrapiURL } from "@iot-portal/frontend/lib/api";
import Link from "next/link";

export default async function Footer() {

    const Para =
        {
            nested: true,
            fields: '*',
            populate: '*'
        }
    ;

    const menus = await (async () => {
        try {
            const response = await fetchAPI("/api/menus/", Para);
            if (response) {
                const filtered = response.data.filter((m: any) => m.attributes.slug === "footer");
                if (filtered.length > 0) {
                    return filtered[0];
                }
            }
        } catch (e) {
            console.warn(e);
        }
        return null;
    })();

    return (
        <div className={"mt-auto"}>
            <footer className={"block bottom-0 h-auto mt-16 bg-orange-100 dark:bg-zinc-900"}>
                <nav
                    className="mx-auto h-full flex flex-row flex-wrap max-w-7xl items-center justify-start gap-16 p-8 lg:px-16 border-solid border-t border-gray-400/30">
                    {
                        menus.attributes.items.data.sort((s: any, sv: any) => s.attributes.order - sv.attributes.order).map((item: any) => {


                            let samePage = true;
                            try {
                                samePage = (new URL(item.attributes.url)).host === getStrapiURL();
                            } catch (e) {

                            }

                            return (
                                <div key={item.id} className={"max-md:w-full max-md:text-center"}>
                                    <h2 className={"text-xl mb-4 border-orange-500 border-b-2 w-max pr-2 max-md:pl-2 max-md:mx-auto"}>
                                        <Link href={item.attributes.url} target={item.attributes.target}>{ item.attributes.title }
                                {!samePage && <ArrowTopRightOnSquareIcon className={"h-[1em] inline touch:p-4"}/>}</Link></h2>
                                    <div className={"flex flex-col gap-2"}>
                                            {
                                                item.attributes.children.data.sort((s: any, sv: any) => s.attributes.order - sv.attributes.order).map((child: any) => {

                                                    let samePage = true;
                                                    try {
                                                        samePage = (new URL(child.attributes.url)).host === getStrapiURL();
                                                    } catch (e) {

                                                    }
                                                    return (<Link key={child.id} href={child.attributes.url}  target={child.attributes.target} className={"flex items-center gap-2 "}>{ child.attributes.title }
                                                        {!samePage && <ArrowTopRightOnSquareIcon className={"h-[1em] inline"}/>}
                                                    </Link>)
                                                })
                                            }
                                    </div>
                                </div>
                            )
                        })
                    }
                </nav>
            </footer>
        </div>
    )
}
