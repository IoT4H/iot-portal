"use client"
import { ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";
import { UserIcon } from "@heroicons/react/24/solid";
import { AuthContext } from "@iot-portal/frontend/app/common/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function AuthHeader() {

    const return_url = usePathname();

    const router = useRouter();

    const auth = useContext(AuthContext);

    const logout = () => {
        auth.logout().then(() => {
            router.refresh();
        });
    }

    const [firstname, SetFirstname] = useState<string | undefined>(undefined);
    const [middlename, SetMiddlename] = useState<string | undefined>(undefined);
    const [lastname, SetLastname] = useState<string | undefined>(undefined);
    const [firmName, SetFirmName] = useState<string | undefined>(undefined);
    const [isAuth, SetIsAuth] = useState<boolean>(false);



    useEffect(() => {
        SetIsAuth(auth.isAuth());
    }, []);

    useEffect(() => {
        if (isAuth) {
            auth.getUser().then((u) => {
                SetFirstname(u.firstname)
                SetMiddlename(u.middlename)
                SetLastname(u.lastname)
                SetFirmName(u.firm ? u.firm.name : undefined);
            }).catch(() => {
                SetFirstname(undefined);
                SetMiddlename(undefined);
                SetLastname(undefined);
                SetFirmName(undefined);
            });
        } else {
            SetFirstname(undefined);
            SetMiddlename(undefined);
            SetLastname(undefined);
            SetFirmName(undefined);
        }
    }, [isAuth])

    return (
        <>
            {
                isAuth ?
                    (
                        <div className={"flex flex-row gap-3 content-center"}>
                            <div className={"flex flex-col justify-center"}>
                                <UserIcon className={"h-8 rounded-3xl bg-white text-gray-400 border-orange-500 border"}></UserIcon>
                            </div>
                            <div className={"flex flex-col justify-center text-sm"}>
                                <span className={"capitalize text-md font-bold"}>{ firstname }{ middlename ? ` ${middlename} ` : " " }{ lastname }</span>
                                <span className={"capitalize text-sm"}>{ firmName }</span>
                            </div>
                            <div className={"flex flex-col justify-center"}>
                                <ArrowRightOnRectangleIcon onClick={() => logout()}
                                                           className="h-6 w-6 inline-block cursor-pointer"></ArrowRightOnRectangleIcon>
                            </div>
                        </div>
                    ) : (
                    <Link href={`/login?return_url=${return_url}`}
                          className="text-sm font-semibold cursor-pointer leading-6 text-gray-900 dark:text-white flex items-center gap-1">
                        Log in <ArrowLeftOnRectangleIcon
                        className="h-6 w-6 inline-block rotate-180"></ArrowLeftOnRectangleIcon>
                    </Link>
                )

            }
        </>
    );
}
