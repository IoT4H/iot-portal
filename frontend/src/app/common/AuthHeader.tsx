"use client"
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import { AuthContext } from "@iot-portal/frontend/app/common/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";

export default function AuthHeader() {

    const return_url = usePathname();

    const auth = useContext(AuthContext);
    return (
        <Link href={`/login?return_url=${return_url}`} className="text-sm font-semibold leading-6 text-gray-900 dark:text-white flex items-center gap-1">
            Log in <ArrowRightOnRectangleIcon className="h-6 w-6 inline-block"></ArrowRightOnRectangleIcon>
        </Link>
    );
}
