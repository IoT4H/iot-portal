import BaseBody from "@iot-portal/frontend/app/common/baseBody";

export default function Layout ({
                                    children, // will be a page or nested layout
                                }: {
    children: React.ReactNode
}) {

    return <BaseBody>
            <article
                className="rounded bg-white dark:bg-zinc-800 w-max mx-auto p-8 shadow max-h-full sticky top-0 flex flex-col gap-4">
                <div className={"flex flex-col gap-8"}>
                    {children}
                </div>
            </article>
        </BaseBody>;
}
