import { PhotoIcon } from "@heroicons/react/20/solid";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { Copyright } from "@iot-portal/frontend/app/common/galleryImage";
import { getStrapiURL, getStrapiURLForFrontend } from "@iot-portal/frontend/lib/api";
import Link from "next/link";
import * as React from "react";
import CustomMarkdown from "../common/CustomMarkdown";


export const dynamic = 'force-dynamic';

export type UseCase = {
  id: number;
  title: string;
  slug: string;
  thumbnail?: any;
  summary: string;
  description: string;
  pictures?: any[];
  tags: string[];
  devices: any[];
  setupDuration?: number | null;
  complexity?: number | null;
  instructions: any[];
  costs?: number | null;
  firms: any[];
  partnerLogos: any[];
  setupSteps: any[];
}


export function Badge({ name }: { name: string; color?: string; }) {
  return (
    <span
      className={"inline-flex items-center rounded-md dark:dark:bg-gray-100/10 bg-orange-50 px-2 py-1 text-xs font-medium text-orange-500 ring-1 ring-inset ring-orange-500/10"}>
      {name}
    </span>
  );
}

export function ListItemUseCase({ useCase }: { useCase: UseCase }) {

  console.log(useCase.partnerLogos)

  return (
    <>
      <div className="flex justify-between gap-x-6 snap-center">
        <Link href={"/usecase/" + useCase.slug} className={"w-full group/card"} prefetch={true}>
          <div className="flex flex-col-reverse cursor-pointer w-full min-h-64 dark:bg-zinc-900  h-full border border-gray-500/25 group-hover/card:border-orange-500/25">
            <div className={"flex flex-grow-0 flex-shrink-0 items-center flex-row w-full h-64 relative "}>
              {
                useCase.thumbnail && useCase.thumbnail.url && (
                  <>
                    <img src={getStrapiURLForFrontend() + (useCase.thumbnail.formats.medium?.url || useCase.thumbnail.url)}
                      className={" w-full h-full object-cover gallery-image"} />
                    <Copyright alt={useCase.thumbnail.alternativeText} />
                  </>
                ) || (
                  <div
                    className={" w-full h-full flex items-center justify-center bg-black/20  gallery-image"}>
                    <PhotoIcon className={"w-16 h-16 text-black/70 dark:text-white/30"}></PhotoIcon>
                  </div>
                )
              }
              <button
                className={"absolute bottom-2 right-2 text-right mt-auto ml-auto font-bold bg-orange-500/90 text-white pl-4 pr-2 py-2 w-max flex flex-row gap-2 items-center invisible group-hover/card:visible"}>
                <span>Mehr erfahren</span><ChevronRightIcon className={"h-6"} /></button>

            </div>
            <div
              className={"w-full h-full flex flex-col gap-4 p-8 min-h-[auto]"}>
              <div className="">
                <CustomMarkdown className="text-inherit font-bold text-2xl border-solid border-b-[0.2em] inline-block max-w-full pr-[0.5em] py-1 border-orange-500 pb-[1px]">{useCase.title}</CustomMarkdown>
              </div>
              <div className="flex flex-row gap-2 flex-wrap flex-grow-0 flex-shrink empty:hidden">
                {
                  [...useCase.devices.map((i: any) => {
                    return i.device.data && i.device.data.attributes.name;
                  }), ...useCase.tags].sort().map(b => (<Badge key={b} name={b} />))
                }
              </div>
              <CustomMarkdown className={"dark:text-gray-300 text-sm text-justify min-w-0 min-h-0  text-ellipsis hyphens-auto break-words  flex-grow-0 flex-shrink text-wrap"}>{useCase.summary}</CustomMarkdown>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}

export function ListUseCase({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode
}) {
  return (
    <>
      <div className="flex-auto rounded shadow max-h-full sticky top-0">
        <div className={"grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4"}>
          {children}
        </div>
      </div>
    </>
  );
}
