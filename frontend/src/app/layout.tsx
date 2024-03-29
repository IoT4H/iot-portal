import './globals.css'
import AuthWrapper from "@iot-portal/frontend/app/common/AuthWrapper";
import Footer from "@iot-portal/frontend/app/common/Footer";
import Header from "@iot-portal/frontend/app/common/Header";
import PageBlockingSpinner, { LoadingWrapper } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { Inter } from 'next/font/google';
import { Suspense } from "react";

const inter = Inter({ subsets: ['latin'] })


export async function generateMetadata({ params }: {params: Params}) {

    const pageQsPara =
        {
            fields: '*',
            populate: '*'
        }
    ;

    const page = (await fetchAPI("/api/portal-einstellungen", pageQsPara)).data.attributes || null;

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
        <body className={`${inter.className} min-h-screen h-max flex flex-col dark:bg-black bg-orange-100/20`}>
            <AuthWrapper>
                <LoadingWrapper>
                    <PageBlockingSpinner />
                    <div className={'flex flex-1 flex-col '}>
                        <Header/>
                        <div className={"mb-auto"}>
                            {props.children}
                        </div>
                        {props.auth}
                        {props.setup}
                        <Footer />
                    </div>
                </LoadingWrapper>
            </AuthWrapper>
        </body>
        </html>
    )
}

