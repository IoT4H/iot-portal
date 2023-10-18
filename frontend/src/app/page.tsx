import { fetchAPI } from "@iot-portal/frontend/lib/api";
import Image from 'next/image'
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default async function LandingPage() {

    const qsPara =
        {
            fields: '*',
            populate: '*'
        }
    ;

    const load = (await fetchAPI('/startpage', qsPara));
    const page = load ? load.data.attributes : null;
    console.log(page)

    return (
        <main className="flex h-full flex-col items-center justify-between p-24 text-center justify-center align-middle">
            <ReactMarkdown className={'markdown mx-8'}>{page.content}</ReactMarkdown>
            <h2>
                <img src={"/undraw_arrow orange.svg"} className={"absolute w-32 -ml-32 -mt-12"}/>
                <Link href={'/home'} className={'p-3 px-8 rounded bg-orange-500/20 hover:bg-orange-500/50 cursor-pointer'}>Go to <b>Home</b></Link>
            </h2>

        </main>
    )
}
