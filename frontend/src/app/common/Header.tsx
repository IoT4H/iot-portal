import { ArrowTopRightOnSquareIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import AuthHeader from "@iot-portal/frontend/app/common/AuthHeader";
import { fetchAPI, getStrapiURL } from "@iot-portal/frontend/lib/api";
import Link from "next/link";
import { Suspense } from "react";

function Logo() {
    return (
            <Link href="/" className="-m-1.5 p-1.5 flex">
                <img className="h-10 w-auto" src="/iot4h.svg" alt="IoT4H" />
                <h1 className="text-black dark:text-white text-3xl font-bold border-black/50 dark:border-white/50 border-l-2 pl-4 ">Portal</h1>
            </Link>
    );
}

const Header = async () => {


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
                const filtered = response.data.filter((m: any) => m.attributes.slug === "menu");
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
        <header className="sticky top-0 h-16 z-40 bg-orange-100 dark:bg-zinc-900 backdrop-blur-sm">
            <nav
                className="mx-auto h-full flex max-w-7xl items-center justify-between p-2 lg:px-8 border-solid border-b border-gray-400/30 dark:border-gray-50/30"
                aria-label="Global">
                <div className="flex lg:flex-1">
                    <Logo/>
                </div>
                <div className={"ml-4 mr-auto flex flex-row gap-2"}>
                    <Suspense>
                    {
                        menus && menus.attributes.items.data.sort((s: any, sv: any) => s.attributes.order - sv.attributes.order).map((item: any) => {


                            let samePage = true;
                            try {
                                samePage = (new URL(item.attributes.url)).host === getStrapiURL();
                            } catch (e) {

                            }

                            return (<Link key={item.id} href={item.attributes.url} className={`group flex items-center gap-2  border-b-4 pb-4 mt-3 hover:border-orange-500 border-gray-400/30 px-4 py-2`} target={item.attributes.target}>{ item.attributes.title }
                                {!samePage && <ArrowTopRightOnSquareIcon className={"h-[1em] inline"}/>}
                                { item.attributes.children.data.length > 0 && (<div className={"submenu fixed left-0 right-0 w-auto top-12 mx-auto max-w-7xl h-auto hidden group-hover:block min-h-[20em] pt-8 z-40"}>
                                <div className={"rounded shadow-2xl  cursor-default dark:shadow-orange-500/20 w-1/2 mx-auto min-w-[30%] border-solid border border-orange-500 bg-orange-50 box-content dark:bg-zinc-900 pt-6 px-16 pb-8 text-black dark:text-white"}>
                                    <div className={"mb-4 mt-0"}><h2 className={"font-bold text-xl border-solid border-b-4 inline-block mb-2 pr-2 py-1 border-orange-500 "}>{ item.attributes.title }</h2></div>
                                    <div className={"grid gap-2 grid-cols-2"}>
                                        {
                                            item.attributes.children.data.sort((s: any, sv: any) => s.attributes.order - sv.attributes.order).map((child: any) => {

                                                let samePage = true;
                                                try {
                                                    samePage = (new URL(child.attributes.url)).host === getStrapiURL();
                                                } catch (e) {

                                                }
                                                return (<Link key={child.id} href={child.attributes.url} className={`group/link flex w-full flex-row text-black dark:text-white grid-cols-2 items-center gap-2 border-gray-300/40 border-l-4 px-4 py-2 bg-gray-300/20 hover:border-orange-500`} target={child.attributes.target}>{ child.attributes.title }
                                                    {!samePage && <ArrowTopRightOnSquareIcon className={"h-[1em] inline "}/>}
                                                    <ChevronDoubleRightIcon className={"w-6 inline ml-auto text-black dark:text-white group-hover/link:text-orange-500"}/>
                                                </Link>)
                                            })
                                        }
                                    </div>
                                </div>
                            </div>) } </Link>)
                        })
                    }
                    </Suspense>
                </div>
                <div className="flex flex-1 justify-end">
                    <AuthHeader/>
                </div>
            </nav>
        </header>
    )
}


export default Header;
