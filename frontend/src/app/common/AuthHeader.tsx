"use client";
import { ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import { UserIcon } from "@heroicons/react/24/solid";
import { AuthContext } from "@iot-portal/frontend/app/common/AuthContext";
import { TextSkeleton } from "@iot-portal/frontend/app/common/skeletons/textWithHeadline";
import { Auth, useIsAuth } from "@iot-portal/frontend/lib/auth";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const LoggedIn = ({ user }: { user: any }) => {
    const [displayFirm, SetDisplayFirm] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (
            user?.firm?.name
                ?.toLowerCase()
                .startsWith(`${user?.firstname} ${user?.lastname}`.toLowerCase()) ||
            user?.firm?.name?.toLowerCase() === user?.email?.toLowerCase()
        ) {
            SetDisplayFirm("Persönlicher Account");
        } else {
            SetDisplayFirm(user?.firm.name);
        }
    }, [user]);

    return (
        <div className={"flex flex-row gap-3 content-center not:sr-only"}>
            <div className={"flex flex-col justify-center"}>
                <UserIcon
                    className={
                        "h-8 rounded-3xl bg-white text-gray-400 border-orange-500 border aspect-square"
                    }
                ></UserIcon>
            </div>
            <div className={"flex flex-col justify-center text-sm"}>
                {user ? (
                    <>
                        <span className={"uppercase text-md font-bold"}>
                            {user?.firstname} {user?.lastname}
                        </span>
                        {displayFirm ? (
                            <span className={"text-sm"}>{displayFirm}</span>
                        ) : (
                            <TextSkeleton className={"w-20"} />
                        )}
                    </>
                ) : (
                    <>
                        <TextSkeleton className={"w-20"} />
                        <TextSkeleton className={"w-20"} />
                    </>
                )}
            </div>
            <div className={"flex flex-col justify-center"} onClick={() => Auth.logout()}>
                <ArrowRightOnRectangleIcon className="h-6 w-6 inline-block cursor-pointer"></ArrowRightOnRectangleIcon>
            </div>
        </div>
    );
};

const NotLoggedIn = () => {
    const params = useSearchParams();
    const currentPath = usePathname();
    const return_url = params.get("return_url") || currentPath == "/login/" ? "/home" : currentPath;

    return (
        <div>
            <Link
                href={`/login?return_url=${return_url}`}
                className="text-sm font-semibold cursor-pointer leading-6 text-gray-900 dark:text-white flex items-center gap-1 not:sr-only"
            >
                Log in{" "}
                <ArrowLeftOnRectangleIcon className="h-6 w-6 inline-block rotate-180"></ArrowLeftOnRectangleIcon>
            </Link>
        </div>
    );
};

export default function AuthHeader() {
    const user = useContext(AuthContext);

    const isAuth = useIsAuth();

    if (isAuth) {
        return (
            <div>
                <LoggedIn user={user} />
            </div>
        );
    } else {
        return (
            <div>
                <NotLoggedIn />
            </div>
        );
    }
}
