import { fakerDE as faker } from "@faker-js/faker";
import { StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarFilledIcon } from "@heroicons/react/24/solid"
import { ChevronRightIcon } from "@heroicons/react/24/solid";


export function Badge({ name } : { name: string; color?: string; }) {
    return (
        <span className={"inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-700/10"}>
            { name }
        </span>
    );
}
export function ListItemUseCase ({ title, description } : { title: string; description: string; }) {
    return (
        <>
            <li className="flex justify-between gap-x-6 py-5">
                <div className="flex flex-row gap-x-4 rounded-xl p-4 cursor-pointer hover:bg-gray-400/10">
                    <div>
                        <div className="flex flex-row items-center pb-2"><span className={"group flex flex-row items-center text-yellow-400"}><StarIcon className={"group-hover:hidden h-5 w-5 inline-block mr-2"}/><StarFilledIcon className={"hidden group-hover:inline-block h-5 w-5 mr-2"}/></span><h3 className={"font-bold text-inherit"}>{ title }</h3> </div>
                        <p className={"dark:text-gray-300 text-sm"}>{ description }</p>
                        <div className="flex flex-row gap-2 mt-4">
                            <Badge name={faker.word.noun()}/>
                            <Badge name={faker.word.noun()}/>
                            <Badge name={faker.word.noun()}/>
                            <Badge name={faker.word.noun()}/>
                            <Badge name={faker.word.noun()}/>
                            <Badge name={faker.word.noun()}/>
                        </div>
                    </div>
                    <div className={"flex items-center flex-row"}>
                        <ChevronRightIcon  className={"w-6 h-6"}/>
                    </div>
                </div>
            </li>
        </>
    );
}

export function ListUseCase ({  title,
                                 children,
                             }: {
    title: string;
    children: React.ReactNode
}) {
    return (
        <>
            <div className="flex-auto rounded bg-white dark:bg-zinc-950 p-4 shadow">
                <h2 className={"dark:text-white font-bold text-xl border-solid border-b-4 inline-block pr-2 py-1 border-orange-500"}>{ title }</h2>
                <ul role="list" className="divide-y dark:divide-gray-100/10">
                    { children }
                </ul>
            </div>
        </>
    );
}
