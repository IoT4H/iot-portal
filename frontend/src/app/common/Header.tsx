'use client';
import * as React from "react";
import { Fragment, useState } from 'react'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react'
import {
    ArrowPathIcon,
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline'


type HeroIcons = React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
    title?: string;
    titleId?: string
} & React.RefAttributes<SVGSVGElement>>;

const links: ({
    name: string;
    icon: HeroIcons;
    description: string;
    href: string
})[] = [
    /* { name: 'Home', description: 'Startseite', href: '/', icon: ArrowPathIcon },
    { name: 'Über IoT4H', description: 'Projekt Seite', href: 'https://iot4h.de', icon: ArrowPathIcon }, */
]

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-40">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 border-solid border-b border-gray-500/10 dark:border-amber-50/10" aria-label="Global">
                <div className="flex lg:flex-1">
                    <a href="/" className="-m-1.5 p-1.5 flex">
                        <span className="sr-only">IoT4H Portal</span>
                        <img className="h-8 w-auto mr-4" src="/iot4h_logo_cropped_normal.png" alt="" />
                        <h1 className="text-black dark:text-white text-3xl font-bold border-l-2 pl-4">Portal</h1>
                    </a>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-amber-50"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {
                        links.map(link =>
                            <a key={link.name}
                                href={ link.href }
                                className="text-sm font-semibold leading-6 text-gray-900 dark:text-amber-50"
                            >
                                { link.name }
                            </a>
                        )
                    }
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <a href={'/login'} className="text-sm font-semibold leading-6 text-gray-900 dark:text-amber-50">
                        Log in <span aria-hidden="true">&rarr;</span>
                    </a>
                </div>
            </nav>
            <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-black dark:text-amber-50 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:sm:ring-amber-50/10">
                    <div className="flex items-center justify-between">
                        <a href="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">IoT4H Portal</span>
                            <img
                                className="h-8 w-auto"
                                src="/iot4h_logo_cropped_normal.png"
                                alt=""
                            />
                        </a>
                        <button
                            type="button"
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10 dark:divide-amber-50/10">
                            <div className="space-y-2 py-6">
                                {
                                    links.map(link => (
                                        <a  key={link.name}
                                            href={ link.href }
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-amber-100/50 dark:text-amber-50 hover:dark:bg-amber-100/20"
                                        >
                                            { link.name }
                                        </a>)
                                    )
                                }
                            </div>
                            <div className="py-6">
                                <a
                                    href={'/login'}
                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900  hover:bg-amber-100/50 dark:text-amber-50 hover:dark:bg-amber-100/20"
                                >
                                    Log in
                                </a>
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </header>
    )
}
