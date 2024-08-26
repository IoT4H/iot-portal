"use client"
import { ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";
import { UserIcon } from "@heroicons/react/24/solid";
import { AuthContext } from "@iot-portal/frontend/app/common/AuthContext";
import { LoadingState } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import { TextSkeleton } from "@iot-portal/frontend/app/common/skeletons/textWithHeadline";
import { Auth } from "@iot-portal/frontend/lib/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useContext, useEffect, useState } from "react";

export default function AuthHeader() {

    const return_url = usePathname();

    const user = useContext(AuthContext);

    const [isAuth, SetIsAuth] = useState<boolean>(false);

    useEffect(() => {
        SetIsAuth(user !== undefined);

        if(user) {
            console.log(`Authenticated User changed: ${user?.firstname} ${user?.lastname}`)
        }

    }, [user])

    return (
        <>
            {
                Auth.isAuth() ?
                    (
                        <div className={"flex flex-row gap-3 content-center not:sr-only"}>
                            <div className={"flex flex-col justify-center"}>
                                <Suspense>{user && <UserIcon className={"h-8 rounded-3xl bg-white text-gray-400 border-orange-500 border aspect-square"}></UserIcon> }</Suspense>
                            </div>
                            <div className={"flex flex-col justify-center text-sm"}>
                                <Suspense>{user && <span className={"capitalize text-md font-bold"}>{ user.firstname } { user.lastname }</span>}</Suspense>
                                <Suspense>{user && <span className={"capitalize text-sm"}>{ (user.firm && user.firm.name ) && (user.firm.name === `${ user.firstname } ${ user.lastname }` ? "Persönlicher Account" : user.firm.name) }</span>}</Suspense>
                            </div>
                            <div className={"flex flex-col justify-center"} onClick={() => Auth.logout()}>
                                <ArrowRightOnRectangleIcon className="h-6 w-6 inline-block cursor-pointer"></ArrowRightOnRectangleIcon>
                            </div>
                        </div>
                    ) : (
                    <Link href={`/login?return_url=${return_url}`}
                          className="text-sm font-semibold cursor-pointer leading-6 text-gray-900 dark:text-white flex items-center gap-1 not:sr-only">
                        Log in <ArrowLeftOnRectangleIcon
                        className="h-6 w-6 inline-block rotate-180"></ArrowLeftOnRectangleIcon>
                    </Link>
                )

            }
        </>
    );
}
