"use client";
import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import LinkPreviewCard from "@iot-portal/frontend/app/common/LinkPreviewCard";
import { BlocksContent, BlocksRenderer as StrapiBlocksRenderer } from "@strapi/blocks-react-renderer";
import Link from "next/link";
import * as React from "react";
import { useCallback } from "react";

const BlocksRenderer = ({
    content,
    className = ""
}: {
    content: BlocksContent;
    className?: string;
}) => {

  const images = useCallback(() => content.filter((b) => {
    return b.type == "image";
  }).map((block: { image: any } | any) => block.image), [content]);


  const imageIndexPos = useCallback((image: any) => {
    return images().findIndex((b: any) => b.hash === image.hash);
  }, [images]);


  return (
    <div
      className={`markdown group/markdown  ${className ? className : ""} flex flex-row flex-wrap w-full justify-center gap-y-1 gap-x-1 wrap-break-word text-pretty whitespace-pre-line`}>
            <StrapiBlocksRenderer
                content={content}
                blocks={{
                    paragraph: ({
                        children,
                        plainText
                    }: {
                        children?: React.ReactNode;
                        plainText?: string;
                    }) => {
                        return (
                          <p
                            className="w-full text-neutral wrap-break-word pre-l dark:text-white my-2 selection:bg-orange-100/10 selection:text-orange-500 last:mb-0">
                                {plainText || children || ""}
                            </p>
                        );
                    },
                    heading: ({ children, plainText, level }) => {
                        switch (level) {
                            case 1:
                                return (
                                  <div className={" w-full"}>
                                        <h1 className="dark:text-white font-bold text-3xl border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]">
                                            {children || plainText}
                                        </h1>
                                    </div>
                                );
                            case 2:
                                return (
                                  <div className={" w-full"}>
                                        <h2 className="dark:text-white font-bold text-2xl border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]">
                                            {children || plainText}
                                        </h2>
                                    </div>
                                );
                            case 3:
                                return (
                                  <div className={" w-full"}>
                                        <h3 className="dark:text-white font-bold text-xl  border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]">
                                            {children || plainText}
                                        </h3>
                                    </div>
                                );
                            case 4:
                                return (
                                  <div className={" w-full"}>
                                        <h4 className="dark:text-white font-bold text-lg  border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]">
                                            {children || plainText}
                                        </h4>
                                    </div>
                                );
                            case 5:
                                return (
                                  <div className={" w-full"}>
                                        <h5 className="dark:text-white font-bold text-md  border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]">
                                            {children || plainText}
                                        </h5>
                                    </div>
                                );
                            case 6:
                                return (
                                  <div className={" w-full"}>
                                        <h6 className="dark:text-white font-bold text-md  border-solid border-b-[0.2em] inline-block pr-[0.5em] py-1 border-orange-500 pb-[1px]">
                                            {children || plainText}
                                        </h6>
                                    </div>
                                );
                            default:
                                return (
                                  <div className={""}>
                                        <h4 className={"text-xl font-bold dark:text-white"}>
                                            {children || plainText}
                                        </h4>
                                    </div>
                                );
                        }
                    },
                    list: ({ format, children, plainText }) => {
                        switch (format) {
                            case "ordered":
                                return (
                                    <ol
                                        className={
                                          "w-full list-decimal selection:bg-orange-100/10" +
                                          " selection:text-orange-500"
                                        }
                                    >
                                        {children || plainText}
                                    </ol>
                                );
                            case "unordered":
                            default:
                                return (
                                    <ul
                                        className={
                                          "w-full list-disc  selection:bg-orange-100/10" +
                                          " selection:text-orange-500"
                                        }
                                    >
                                        {children || plainText}
                                    </ul>
                                );
                        }
                    },
                    "list-item": ({ children, plainText }) => {
                        return (
                            <li
                                className={
                                  "list-inside list-[inherit] selection:bg-orange-100/10 selection:text-orange-500"
                                }
                            >
                                {children || plainText}
                            </li>
                        );
                    },
                    link: ({ children, plainText, url }) => {
                        return (
                            <Link
                                className={
                                    "text-orange-500 underline-offset-4 underline  selection:bg-orange-100/10 selection:text-orange-500 relative "
                                }
                                href={url}
                            >
                                <LinkPreviewCard href={url} />
                                {plainText || children}
                            </Link>
                        );
                    },
                    image: ({ image }) => {
                        if (!image.url) {
                            return null;
                        }

                        return (
                            <GalleryImage
                                className={
                                  " h-max max-h-64 object-contain max-w-min"
                                }
                                wrapperClassName={"  flex-nowrap w-fit" +
                                  " max-w-[50%]"}
                                alt={image.alternativeText || undefined}
                                thumbnailSrc={image.previewUrl || image.url}
                                caption={image.caption || undefined}
                                src={image.url}
                                imageList={images()}
                                init={imageIndexPos(image)}
                            />
                        );
                    },
                    quote: ({ children, plainText }) => {
                        return (
                            <blockquote
                              className={"p-2 border-l-4 border-orange-500"}
                            >
                                {children || plainText}
                            </blockquote>
                        );
                    },
                    code: ({ children, plainText }) => {
                        return (
                          <pre className={``}>
                                <code>{children || plainText}</code>
                            </pre>
                        );
                    }
                }}
                modifiers={{
                    bold: ({ children }) => <span className={"font-bold"}>{children}</span>,
                    italic: ({ children }) => <span className={"italic"}>{children}</span>,
                    code: ({ children }) => <code>{children}</code>,
                    underline: ({ children }) => <span className={"underline"}>{children}</span>,
                    strikethrough: ({ children }) => (
                        <span className={"line-through"}>{children}</span>
                    )
                }}
            ></StrapiBlocksRenderer>
        </div>
    );
};

export default BlocksRenderer;
