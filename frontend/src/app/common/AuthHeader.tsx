"use client"
import { ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";
import { UserIcon } from "@heroicons/react/24/solid";
import { AuthContext } from "@iot-portal/frontend/app/common/AuthContext";
import { Auth } from "@iot-portal/frontend/lib/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function AuthHeader() {

    const return_url = usePathname();

    const user = useContext(AuthContext);

    const [isAuth, SetIsAuth] = useState<boolean>(false);

    useEffect(() => {
        SetIsAuth(user !== undefined);
    }, [user])

    return (
        <>
            {
                isAuth && user ?
                    (
                        <div className={"flex flex-row gap-3 content-center not:sr-only"}>
                            <div className={"flex flex-col justify-center"}>
                                <UserIcon className={"h-8 rounded-3xl bg-white text-gray-400 border-orange-500 border"}></UserIcon>
                            </div>
                            <div className={"flex flex-col justify-center text-sm"}>
                                <span className={"capitalize text-md font-bold"}>{ user.firstname }{ user.middlename ? ` ${user.middlename} ` : " " }{ user.lastname }</span>
                                <span className={"capitalize text-sm"}>{ user.firm && user.firm.name }</span>
                            </div>
                            <div className={"flex flex-col justify-center"}>
                                <ArrowRightOnRectangleIcon onClick={() => Auth.logout()}
                                                           className="h-6 w-6 inline-block cursor-pointer"></ArrowRightOnRectangleIcon>
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
