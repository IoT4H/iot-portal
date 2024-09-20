import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import Link from "next/link";
import * as React from "react";
import ReactMarkdown from "react-markdown";

export default function CustomMarkdown({children, className, ...rest} : { children: string, className: string }) {

    return <ReactMarkdown className={`${className} *:mb-[1.5rem] *:last:mb-0`} components={
        {
            h1:  (props) => { return <h1 className="dark:text-white font-bold text-3xl  border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]">{props.children}</h1>; } ,
            h2:  (props) => { return <h2 className="dark:text-white font-bold text-2xl  border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]">{props.children}</h2>; } ,
            h3:  (props) => { return <h3 className="dark:text-white font-bold text-xl  border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]">{props.children}</h3>; } ,
            h4:  (props) => { return <h4 className="dark:text-white font-bold text-lg  border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]">{props.children}</h4>; } ,
            h5:  (props) => { return <h5 className="dark:text-white font-bold text-md  border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]">{props.children}</h5>; } ,
            h6:  (props) => { return <h6 className="dark:text-white font-bold text-md  border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]">{props.children}</h6>; } ,
            img: (props) => {
                const {node, ...rest} = props;

                if(!rest.src) {
                    return null;
                }
                const thumbnail = rest.src.replace("/uploads/", "/uploads/thumbnail_")

                return  <GalleryImage  className={" max-h-64 w-full object-contain mb-[1.5rem] last:mb-0"} {...rest} src={rest.src} />;
            },
            p: (props) => {
                return <p className={"w-full text-neutral my-2 selection:bg-orange-100/10 selection:text-orange-500 mb-[1.5rem] last:mb-0"}>{props.children}</p>;
            },
            blockquote(props) {
                return <blockquote className={"p-2 border-l-4 border-orange-500 mb-[1.5rem] last:mb-0"}>{props.children}</blockquote>;
            },
            a: (props) => {
                return props.href ? <Link href={props.href} target={"_blank"}>{ props.children } </Link> : <span> { props.children } </span>
            }
        }
    } {...rest} >{ children }</ReactMarkdown>
}
