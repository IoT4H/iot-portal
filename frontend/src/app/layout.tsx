import './globals.css'
import Header from "@iot-portal/frontend/app/common/Header";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Inter } from 'next/font/google';
import Head from "next/head";

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
    const qsPara =
        {
            fields: '*',
            populate: '*'
        }
    ;


    const page = (await fetchAPI('/portal-einstellungen', qsPara)).data.attributes;
    console.log(page)
    metadata.title = page.title;

    return (
        <html lang="de">
        <Head>
            <title>{page.title}</title>
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

