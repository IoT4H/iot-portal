'use client'
const links: {
    href: string;
    title: string;
}[] = [
    {
        title: "Use-Cases",
        href: "/home"
    },
    {
        title: "Meine Use-Cases",
        href: "/home"
    }
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="shadow bg-orange-100 dark:bg-zinc-900 pb-24 sticky top-0 ">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {
                        links.map((link) =>
                            (
                                <a key={link.title} href={link.href} className={"rounded px-4 py-2 hover:bg-orange-500 hover:dark:bg-orange-500/30 hover:text-white"}>{ link.title }</a>
                            )
                        )
                    }
                </div>
            </div>
            <div className="-my-24  sticky top-0 ">
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </div>
        </>
    );
}
