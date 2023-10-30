import './globals.css'
import Header from "@iot-portal/frontend/app/common/Header";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Inter } from 'next/font/google';
import Head from "next/head";
import { headers } from "next/headers";

const inter = Inter({ subsets: ['latin'] })

export let metadata = {
    title: 'Portal | IoT4H',
    description: 'Das Digitalportal für das Handwerk',
}

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode
}) {
    const headersList = headers()

    const qsPara =
        {
            fields: '*',
            populate: '*'
        }
    ;


    const page = (await fetchAPI('/portal-einstellungen', qsPara)).data.attributes || null;
    if(page) {
        metadata.title = page.title;
        metadata.description = page.description;
    }

    return (
        <html lang="de">
        <Head>
            <title>{metadata.title}</title>
        </Head>
        <body className={`${inter.className} min-h-screen h-max flex`}>
        <div className={'flex flex-1 flex-col '}>
            <Header/>
            {children}
        </div>
        </body>
        </html>
    )
}

