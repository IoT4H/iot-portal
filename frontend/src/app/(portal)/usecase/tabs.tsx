'use client'
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type HeroIcon = React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & {     title?: string | undefined;     titleId?: string | undefined; } & React.RefAttributes<SVGSVGElement>>;



function Tab({Icon, className, name, active, link} : {Icon?: HeroIcon; className?: string; name: string; active?: boolean, link: string }){
    return (
        <Link href={link}>
            <button className={`${className} flex-row flex gap-4 items-center uppercase mx-4 px-4 py-4 border-b-2 ${ active ? 'border-orange-500 hover:border-orange-500' : 'border-transparent hover:border-orange-500/50' }`}>{ Icon && (<Icon className={"h-4"}/>)} {name}</button>
        </Link>
    );
}
export default function Tabs() {

    const router = useRouter();
    const params = useParams();

    return (
        <>
            <Tab name={"Info"} link={`/usecase/${params.id}`}/>
            <Tab name={"Bilder"}  link={`/usecase/${params.id}/bilder`}/>
            <Tab name={"Anleitung"} link={`/usecase/${params.id}/instructions`}/>
        </>
    );
}
