"use client";
import BaseLayout from "@iot-portal/frontend/app/common/baseLayout";
import { useIsAuth } from "@iot-portal/frontend/lib/auth";

type Link = {
    href: string;
    title: string;
    deactivated: () => boolean;
};

export const dynamic = "force-dynamic";

export default function UsecasesLayout({ children }: { children: React.ReactNode }) {
    const isAuth = useIsAuth();

    const links: Link[] = [
        {
            title: "Anwendungsfälle",
            href: "/usecase/",
            deactivated: () => false
        },
        {
            title: "Meine Anwendungsfälle",
            href: "/mine/",
            deactivated: () => !isAuth
        }
    ];

    return <BaseLayout links={links}>{children}</BaseLayout>;
}
