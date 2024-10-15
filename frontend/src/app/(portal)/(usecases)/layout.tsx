'use client'
import BaseLayout from "@iot-portal/frontend/app/common/baseLayout";
import { useIsAuth } from "@iot-portal/frontend/lib/auth";


type Link = {
    href: string;
    title: string;
    deactived: () => boolean;
}


export const dynamic = 'force-dynamic';

export default function UsecasesLayout({ children }: { children: React.ReactNode }) {


    const isAuth = useIsAuth();

    const links: Link[] = [
        {
            title: "Anwendungsfälle",
            href: "/usecase/",
            deactived: () => false,
        },
        {
            title: "Meine Anwendungsfälle",
            href: "/mine/",
            deactived: () => !isAuth,
        }
    ];

    return (
        <BaseLayout links={links}>
            {children}
        </BaseLayout>
    );
}
