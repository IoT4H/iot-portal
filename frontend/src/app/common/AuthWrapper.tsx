"use client"

import { AuthContext } from "@iot-portal/frontend/app/common/AuthContext";
import { Auth } from "@iot-portal/frontend/lib/auth";
import { useState } from "react";
export default function AuthWrapper ({children} : {children: any}) {

    const [auth, SetAuth] = useState<Auth>(new Auth())

    auth.onLogin = () => {
        SetAuth(auth);
    }

    return <AuthContext.Provider value={auth}>
            {children}</AuthContext.Provider>
}
