"use client"

import { LoadingContext } from "@iot-portal/frontend/app/common/pageBlockingSpinner";
import { useContext } from "react";

export default function Loading(){


    const loading = useContext(LoadingContext)

    return <div>LOADING....</div>;
}
