import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import LinkPreviewCard from "@iot-portal/frontend/app/common/LinkPreviewCard";
import Link from "next/link";
import * as React from "react";
import ReactMarkdown from "react-markdown";

export default function CustomMarkdown({children, className, ...rest}: { children: string, className: string }) {

    return <ReactMarkdown className={`${className} *:mb-[1.5rem] *:last:mb-0`} components={
        {
            h1: (props) => {
                return <h1
                    className="dark:text-white font-extrabold text-3xl "><span className={"border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]"}>{props.children}</span></h1>;
            },
            h2: (props) => {
                return <h2
                    className="dark:text-white font-extrabold text-2xl "><span className={"border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]"}>{props.children}</span></h2>;
            },
            h3: (props) => {
                return <h3
                    className="dark:text-white font-extrabold text-xl  "><span className={"border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]"}>{props.children}</span></h3>;
            },
            h4: (props) => {
                return <h4
                    className="dark:text-white font-bold text-xl  "><span className={"inline-block"}>{props.children}</span></h4>;
            },
            h5: (props) => {
                return <h5
                    className="dark:text-white font-bold text-lg  "><span className={"inline-block"}>{props.children}</span></h5>;
            },
            h6: (props) => {
                return <h6
                    className="dark:text-white font-bold text-md  "><span className={"inline-block"}>{props.children}</span></h6>;
            },
            img: (props) => {
                const {node, ...rest} = props;

                if (!rest.src) {
                    return null;
                }
                const thumbnail = rest.src.replace("/uploads/", "/uploads/thumbnail_")

                return <GalleryImage className={" max-h-64 w-full object-contain mb-[1.5rem] last:mb-0"} {...rest}
                                     src={rest.src} thumbnailSrc={rest.src}/>;
            },
            p: (props) => {
                return <p
                    className={"w-full text-neutral my-2 selection:bg-orange-100/10 selection:text-orange-500 mb-[1.5rem] last:mb-0"}>{props.children}</p>;
            },
            blockquote(props) {
                return <blockquote className={"p-2 border-l-4 border-orange-500 mb-[1.5rem] last:mb-0"}>{props.children}</blockquote>;
            },
            a: (props) => {

                return props.href ? <Link prefetch={true} className={"group/link text-orange-500 underline-offset-4 underline relative selection:bg-orange-100/10 selection:text-orange-500 decoration-2 font-bold"} href={props.href} target={"_blank"}>
                     <LinkPreviewCard href={props.href} />
                    { props.children }
                </Link> : <span>{ props.children }</span>
            }
        }
    } {...rest} >{ children }</ReactMarkdown>
}
