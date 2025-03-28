import { ArrowTopRightOnSquareIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import { NavLink } from "@iot-portal/frontend/app/common/navLink";
import AuthHeader from "@iot-portal/frontend/app/common/AuthHeader";
import { fetchAPI, getStrapiURL } from "@iot-portal/frontend/lib/api";
import Link from "next/link";
import { Suspense, useCallback } from "react";
import PlatformButton from "./PlatformButton";

function Logo() {
    return (
            <Link href="/" className="-m-1.5 p-1.5 flex">
                { /* eslint-disable-next-line @next/next/no-img-element */}
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
        <header className="sticky top-0 h-16 z-40 bg-orange-100 dark:bg-zinc-800 backdrop-blur-sm">
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
                            return (<NavLink key={item.attributes.url} {...item} />)
                        })
                    }
                    </Suspense>
                </div>
                <div className="flex flex-1 justify-end">
                    <PlatformButton></PlatformButton>
                    <AuthHeader/>
                </div>
            </nav>
        </header>
    )
}


export default Header;
