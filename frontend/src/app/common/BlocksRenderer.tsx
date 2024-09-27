"use client"
import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import LinkPreviewCard from "@iot-portal/frontend/app/common/LinkPreviewCard";
import { BlocksRenderer as StrapiBlocksRenderer, BlocksContent } from "@strapi/blocks-react-renderer";
import Link from "next/link";
import * as React from "react";

const BlocksRenderer = ({content, className}: {content: BlocksContent, className?: string}) => <div className={`markdown group/markdown  ${className ? className : ""}`}><StrapiBlocksRenderer content={content || []} blocks={{
    paragraph: ({ children, plainText }) => <p className="w-full text-neutral  my-2 selection:bg-orange-100/10 selection:text-orange-500 mb-[1.5rem] last:mb-0">{children || plainText}</p>,
    heading: ({ children, plainText, level }) => {
        switch (level) {
            case 1:
                return <div className={"mb-1 mt-0.5"}><h1 className="dark:text-white font-bold text-3xl border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]">{children || plainText}</h1></div>
            case 2:
                return <div className={"mb-1 mt-0.5"}><h2 className="dark:text-white font-bold text-2xl border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]">{children || plainText}</h2></div>
            case 3:
                return <div className={"mb-1 mt-0.5"}><h3 className="dark:text-white font-bold text-xl  border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]">{children || plainText}</h3></div>
            case 4:
                return <div className={"mb-1 mt-0.5"}><h4 className="dark:text-white font-bold text-lg  border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]">{children || plainText}</h4></div>
            case 5:
                return <div className={"mb-1 mt-0.5"}><h5 className="dark:text-white font-bold text-md  border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]">{children || plainText}</h5></div>
            case 6:
                return <div className={"mb-1 mt-0.5"}><h6 className="dark:text-white font-bold text-md  border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]">{children || plainText}</h6></div>
            default:
                return <div className={" mb-[1.5rem] last:mb-0"}><h4 className={"text-xl font-bold"}>{children || plainText}</h4></div>
        }
    },
    list: ({format, children, plainText}) => {
        switch (format) {
            case "ordered":
                return <ol
                    className={"w-full  list-outside list-decimal  selection:bg-orange-100/10 selection:text-orange-500 mb-[1.5rem] last:mb-0"}>{children || plainText}</ol>
            case "unordered":
            default:
                return <ul className={"w-full  list-outside list-disc  selection:bg-orange-100/10 selection:text-orange-500 mb-[1.5rem] last:mb-0"}>{children || plainText}</ul>
        }
    },
    "list-item": ({children,plainText}) => {
        return <li className={"list-outside  selection:bg-orange-100/10 selection:text-orange-500 mb-[1.5rem] last:mb-0"}>{children || plainText}</li>
    },
    link: ({ children, plainText, url }) => <Link className={"text-orange-500 underline-offset-4 underline  selection:bg-orange-100/10 selection:text-orange-500 relative "} href={url}><LinkPreviewCard href={url} />{children || plainText}</Link>,
    image: ({ image }) => {

        if(!image.url) {
            return null;
        }

        return  <GalleryImage className={" w-max h-max max-h-64 mx-auto object-contain mb-[1.5rem] last:mb-0"} alt={image.alternativeText || ""} thumbnailSrc={image.previewUrl || image.url} caption={image.caption || ""} src={image.url} />;
    },
    quote : ({ children, plainText }) => {
        return <blockquote className={"p-2 border-l-4 border-orange-500 mb-[1.5rem] last:mb-0"}>{children || plainText}</blockquote>;
    },
    code: ({ children, plainText}) => {
        return <pre className={`mb-[1.5rem] last:mb-0`}><code>{children || plainText}</code></pre>
            }
    }
}



    modifiers={{
              bold: ({ children }) => <span className={"font-bold"}>{children}</span>,
              italic: ({ children }) => <span className={"italic"}>{children}</span>,
              code: ({ children}) => <code>{children}</code>,
              underline: ({children}) => <span className={"underline"}>{children}</span>,
              strikethrough: ({children}) => <span className={"line-through"}>{children}</span>
          }}
></StrapiBlocksRenderer></div>;


export default BlocksRenderer;
