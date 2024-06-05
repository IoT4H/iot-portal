'use client'
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

type HeroIcon = React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & {     title?: string | undefined;     titleId?: string | undefined; } & React.RefAttributes<SVGSVGElement>>;



export function Tab({Icon, className, name, link} : {Icon?: HeroIcon; className?: string; name: string; link: string }){

    const pathname = usePathname().replace(/\/+$/, "");
    const calledLink = useMemo(() => link.replace(/\/+$/, ""), [link]);

    return (
        <Link href={link} prefetch={true} replace scroll={false}>
            <button className={`${className} flex-row flex gap-4 items-center uppercase mx-4 px-4 py-4 border-b-2 ${ calledLink == pathname ? 'border-orange-500 hover:border-orange-500' : 'border-transparent hover:border-orange-500/50' }`}>{ Icon && (<Icon className={"h-6"}/>)} {name}</button>
        </Link>
    );
}
export default function Tabs() {

    const params = useParams();

    return (
        <>
            <Tab name={"Info"} link={`/usecase/${params.id}/`}/>
            <Tab name={"Bilder"} link={`/usecase/${params.id}/bilder/`}/>
            <Tab name={"Anleitung"} link={`/usecase/${params.id}/instructions/`}/>
        </>
    );
}
