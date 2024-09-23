import './globals.css'
import AuthWrapper from "@iot-portal/frontend/app/common/AuthWrapper";
import Footer from "@iot-portal/frontend/app/common/Footer";
import Header from "@iot-portal/frontend/app/common/Header";
import PageBlockingSpinner, { LoadingWrapper } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import PromptAreaComponent from "@iot-portal/frontend/app/common/promptArea";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { APITool } from "@iot-portal/frontend/lib/APITool";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { Inter } from 'next/font/google';
import { Suspense } from "react";

const inter = Inter({ subsets: ['latin'] });


export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: {params: Params}) {

    const pageQsPara =
        {
            fields: '*',
            populate: '*'
        }
    ;

    const page = await (async () => {
        const settings = (await fetchAPI("/api/portal-einstellungen", pageQsPara));
        return settings && settings.data ? settings.data.attributes : null;
    })();

    return page ? {
        title: page.title ,
        openGraph: {
            title: page.title,
            type: 'website',
            description: page.description
        },
    } : {};
}
export default async function RootLayout(props: any) {

    return (
        <html lang="de" className={"dark"}>
        <head>
            <link rel="icon" type="image/png" href="/favicon.png"></link>
        </head>
        <body className={`${inter.className} min-h-screen h-max flex flex-col dark:bg-black bg-orange-100/20`}>
            <PromptAreaComponent />
            <AuthWrapper>
                <LoadingWrapper>
                    <PageBlockingSpinner />
                    <div className={'flex flex-1 flex-col '}>
                        {/* @ts-expect-error Server Component */}
                        <Header/>
                        <div className={"mb-auto"}>
                            {props.children}
                        </div>
                        {props.auth}
                        {props.setup}
                        {/* @ts-expect-error Server Component */}
                        <Footer />
                    </div>
                </LoadingWrapper>
            </AuthWrapper>
        </body>
        </html>
    )
}
