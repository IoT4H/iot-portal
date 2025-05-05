"use client"
import { ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";
import { UserIcon } from "@heroicons/react/24/solid";
import { AuthContext } from "@iot-portal/frontend/app/common/AuthContext";
import { LoadingState } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import { TextSkeleton } from "@iot-portal/frontend/app/common/skeletons/textWithHeadline";
import { Auth, useIsAuth } from "@iot-portal/frontend/lib/auth";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Suspense, useContext, useEffect, useState } from "react";


export default function PlatformButton() {


    const user = useContext(AuthContext);

    const isAuth = useIsAuth();

    const router = useRouter();


    if(isAuth) {
        return <Link href={"/login-to-platform"} className={"p-2 mr-4 rounded border-2 border-white"}> Zur Plattform </Link>;
    } else {
        return <></>;
    }

}
