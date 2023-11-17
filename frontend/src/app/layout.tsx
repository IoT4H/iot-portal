import './globals.css'
import Header from "@iot-portal/frontend/app/common/Header";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata({ params }: {params: Params}) {

    const pageQsPara =
        {
            fields: '*',
            populate: '*'
        }
    ;

    const page = (await fetchAPI("/portal-einstellungen", pageQsPara)).data.attributes || null;

    return {
        title: page.title ,
        openGraph: {
            url: 'https://portal.iot4h.de/',
            title: page.title,
            type: 'website',
            description: page.description
        },
    }
}
export default async function RootLayout(props: any) {


    return (
        <html lang="de">
        <body className={`${inter.className} min-h-screen h-max flex`}>
        <div className={'flex flex-1 flex-col '}>
            <Header/>
            {props.children}
            {props.auth}
            {props.setup}
        </div>
        </body>
        </html>
    )
}

