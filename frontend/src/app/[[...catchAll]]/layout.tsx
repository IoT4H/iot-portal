import BaseBody from "@iot-portal/frontend/app/common/baseBody";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Metadata } from "next";
import React from "react";

export const dynamic = "force-dynamic";


type Props = {
  params: { catchAll: string[] }
  searchParams: { [key: string]: string | string[] | undefined }
}


export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const pageQsPara = {
    fields: "*",
    populate: "*"
  };

  const genericPage = await (async () => {
    const settings = await fetchAPI("/api/portal-einstellungen", pageQsPara);
    return settings && settings.data ? settings.data.attributes : null;
  })();


  const data =
    (
      await fetchAPI("/api/pages", {
        fields: "*",
        filters: {
          $or: [
            {
              url: { $eq: "/" + (params.catchAll || []).join("/") }
            },
            {
              url: { $eq: "/" + (params.catchAll || []).join("/") + "/" }
            }
          ]
        }
      })
    )?.data || [];

  if (Array.isArray(data) && data.length === 0) {
    return {};
  }


  const page = data[0].attributes;


  const titles = Array.of(genericPage.title, page.title);

  return genericPage
    ? {
      title: titles.join(" - "),
      openGraph: {
        title: titles.join(" - "),
        type: "website",
        description: genericPage.description
      }
    }
    : {};
}

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
    return (
        <BaseBody>
            <div className="flex-auto rounded bg-white dark:bg-zinc-800 p-4 shadow max-h-full sticky top-0">
                {children}
            </div>
        </BaseBody>
    );
}
