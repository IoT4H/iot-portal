import { BlocksRenderer as StrapiBlocksRenderer, BlocksContent } from "@strapi/blocks-react-renderer";
import Link from "next/link";
import * as React from "react";

const BlocksRenderer = ({content}: {content: BlocksContent}) => <StrapiBlocksRenderer content={content} blocks={{
    paragraph: ({ children }) => <p className="text-neutral max-w-prose my-2 selection:bg-orange-100/10 selection:text-orange-500">{children}</p>,
    heading: ({ children, level }) => {
        switch (level) {
            default:
                return <h4 className={"text-xl font-bold"}>{children}</h4>
        }
    },
    list: ({format,children,plainText}) => {
        switch (format) {
            case "ordered":
                return <ol className={" list-outside list-decimal  selection:bg-orange-100/10 selection:text-orange-500"}>{children}</ol>
            case "unordered":
            default:
                return <ul className={" list-outside list-disc  selection:bg-orange-100/10 selection:text-orange-500"}>{children}</ul>
        }
    },
    "list-item": ({children}) => {
        return <li className={"list-outside  selection:bg-orange-100/10 selection:text-orange-500"}>{children}</li>
    },
    link: ({ children, url }) => <Link className={"text-orange-500 underline-offset-4 underline  selection:bg-orange-100/10 selection:text-orange-500"} href={url}>{children}</Link>,
}}

                                                      modifiers={{
                                                          bold: ({ children }) => <span className={"font-bold"}>{children}</span>,
                                                          italic: ({ children }) => <span className={"italic"}>{children}</span>,
                                                      }}
></StrapiBlocksRenderer>;


export default BlocksRenderer;
