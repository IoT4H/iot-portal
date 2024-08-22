export default function Layout ({ children }: { children: React.ReactNode }) {

    return <>
        <div className="bg-orange-100 dark:bg-zinc-900 sticky top-16 h-16">
        </div>

        <div className={"h-28 bg-orange-100 dark:bg-zinc-900 shadow sticky top-32 -z-10"}></div>
        <div className="mx-auto  py-2 sm:px-6 lg:px-8 -mt-28 w-fit">
            <article
                className="rounded bg-white dark:bg-zinc-800 p-6 shadow max-h-full sticky top-0 flex flex-col gap-4">
                <div className={"flex flex-col gap-8"}>
                    {children}
                </div>
            </article>
        </div>
    </>
}
