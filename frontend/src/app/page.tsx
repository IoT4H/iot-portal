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
        <main className="flex h-full flex-col items-center justify-between p-24 text-center justify-center align-middle">
            <CustomMarkdown className={'markdown mx-8 text-justify'}>{page && page.content}</CustomMarkdown>
            <div className={"mt-8 pt-12"}>
                <img src={"/undraw_arrow orange.svg"} className={"absolute w-32 -ml-32 -mt-12"}/>
                <Link href={'/home'} className={'p-3 px-8 rounded bg-orange-500/20 hover:bg-orange-500/50 cursor-pointer'}>Go to <b>Home</b></Link>
            </div>
        </main>
    )
}
