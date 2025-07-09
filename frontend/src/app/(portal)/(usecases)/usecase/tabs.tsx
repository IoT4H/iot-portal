"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

type HeroIcon = React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
        title?: string | undefined;
        titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
>;

function TabButton(
    p: {
        Icon?: HeroIcon;
        className?: string;
        name: string;
        calledLink: string;
        others?: any[];
    } & any
) {
    const { Icon, className, name, calledLink, ...others } = p;
    const pathname = usePathname().replace(/\/+$/, "");

    return (
        <button
            className={`flex-row flex gap-4 items-center uppercase mx-4 px-4 py-4 border-b-2 ${calledLink == pathname ? "border-orange-500 hover:border-orange-500" : "border-transparent hover:border-orange-500/50"} ${className ?? ""}`}
            {...others}
        >
            {Icon && <Icon className={"h-6"} />} {name}
        </button>
    );
}

export function Tab(p: { Icon?: HeroIcon; className?: string; name: string; link?: string } & any) {
    const { Icon, className, name, link, ...others } = p;
    const calledLink = useMemo(() => (link ?? "").replace(/\/+$/, ""), [link]);

    return link ? (
        <Link href={link} prefetch={true} replace scroll={false}>
            <TabButton
                calledLink={calledLink}
                name={name}
                className={className}
                Icon={Icon}
                {...others}
            />
        </Link>
    ) : (
        <>
            <TabButton
                calledLink={calledLink}
                name={name}
                className={className}
                Icon={Icon}
                {...others}
            />
        </>
    );
}
