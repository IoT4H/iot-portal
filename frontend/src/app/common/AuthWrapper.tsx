"use client";

import { AuthContext } from "@iot-portal/frontend/app/common/AuthContext";
import { Auth, User } from "@iot-portal/frontend/lib/auth";
import { useEffect, useState } from "react";

export default function AuthWrapper({ children }: { children: any }) {
    const [user, SetUser] = useState<User | undefined>(undefined);

    Auth.onUserChange = () => {
        Auth.getUser().then((u) => SetUser(u));
    };

    useEffect(() => {
        Auth.getUser().then((u) => SetUser(u));
    }, []);

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
