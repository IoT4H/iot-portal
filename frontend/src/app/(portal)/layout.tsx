
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
            <div className="shadow bg-orange-100 dark:bg-gray-100/10 pb-24 sticky top-0 ">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {
                        links.map((link) =>
                            (
                                <a key={link.title} href={link.href} className={"rounded px-4 py-2 hover:dark:bg-gray-100/10 hover:bg-orange-500 hover:text-white dark:hover:text-black"}>{ link.title }</a>
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
