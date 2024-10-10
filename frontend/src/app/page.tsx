import BaseBody from "@iot-portal/frontend/app/common/baseBody";
import CustomMarkdown from "@iot-portal/frontend/app/common/CustomMarkdown";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { headers } from "next/headers";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
    const headersList = headers()

    const qsPara =
        {
            fields: '*',
            populate: '*'
        }
    ;

    const load = (await fetchAPI('/api/startpage', qsPara));
    const page = load && load.data ? load.data.attributes : null;

    return (
        <BaseBody>
            <main className="rounded bg-white dark:bg-zinc-800 p-6 shadow max-h-full pt-8 mt-12 gap-4 block relative">
                <CustomMarkdown className={'markdown mx-8 text-justify'}>{page && page.content}</CustomMarkdown>
                <div className={"mt-16 mx-auto w-max h-max relative"}>
                    <img src={"/undraw_arrow orange.svg"} className={"absolute w-32 -ml-32 -mt-8"}/>
                    <Link href={'/home'} className={'py-3 px-8 rounded bg-orange-500/20 hover:bg-orange-500/50 cursor-pointer box-border block'}>Go to <b>Home</b></Link>
                </div>
            </main>
        </BaseBody>
    )
}
