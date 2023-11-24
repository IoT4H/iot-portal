import AuthHeader from "@iot-portal/frontend/app/common/AuthHeader";
import Link from "next/link";

function Logo() {
    return (
            <Link href="/" className="-m-1.5 p-1.5 flex">
                <img className="h-10 w-auto" src="/iot4h.svg" alt="IoT4H" />
                <h1 className="text-black dark:text-white text-3xl font-bold border-black/50 dark:border-white/50 border-l-2 pl-4 ">Portal</h1>
            </Link>
    );
}

export default function Header() {

    return (
        <header className="sticky top-0 h-16 z-40 bg-orange-100 dark:bg-zinc-900 backdrop-blur-sm">
            <nav className="mx-auto h-full flex max-w-7xl items-center justify-between p-2 lg:px-8 border-solid border-b border-gray-400/30 dark:border-gray-50/30" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Logo />
                </div>
                <div className="flex flex-1 justify-end">
                    <AuthHeader />
                </div>
            </nav>
        </header>
    )
}
