"use client";
import ConfigurationSteps from "@iot-portal/frontend/app/(portal)/(usecases)/mine/[id]/configurationSteps";
import Loading from "@iot-portal/frontend/app/(portal)/(usecases)/mine/[id]/start/loading";
import { Suspense } from "react";

const Page = ({ params }: { params: { id: number } }) => {
    return (
        <Suspense fallback={<Loading />}>
            <ConfigurationSteps params={params} />
        </Suspense>
    );
};
export default Page;
