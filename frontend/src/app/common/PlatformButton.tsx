"use client";
import { AuthContext } from "@iot-portal/frontend/app/common/AuthContext";
import { useIsAuth } from "@iot-portal/frontend/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function PlatformButton() {
    const user = useContext(AuthContext);

    const isAuth = useIsAuth();

    const router = useRouter();

    if (
        isAuth &&
        (user?.firm.platformButton == "true" ||
            (user?.firm.platformButton == "user" && user?.platformButton))
    ) {
        return (
            <Link href={"/login-to-platform"} className={"p-2 mr-4 rounded border-2 border-white"}>
                {" "}
                Zur Plattform{" "}
            </Link>
        );
    } else {
        return <></>;
    }
}
