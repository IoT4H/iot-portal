import './globals.css'
import { mapUseCase, UseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import Header from "@iot-portal/frontend/app/common/Header";
import { fetchAPI, getStrapiURL } from "@iot-portal/frontend/lib/api";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { Inter } from 'next/font/google';
import Head from "next/head";
import { headers } from "next/headers";

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
export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode
}) {

    return (
        <html lang="de">
        <body className={`${inter.className} min-h-screen h-max flex`}>
        <div className={'flex flex-1 flex-col '}>
            <Header/>
            {children}
        </div>
        </body>
        </html>
    )
}

