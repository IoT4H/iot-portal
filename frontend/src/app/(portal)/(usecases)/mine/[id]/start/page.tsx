"use client"
import ConfigurationSteps from "@iot-portal/frontend/app/(portal)/(usecases)/mine/[id]/configurationSteps";
import Loading from "@iot-portal/frontend/app/(portal)/(usecases)/mine/[id]/start/loading";
import TextWithHeadline, { StepSkeleton } from "@iot-portal/frontend/app/common/skeletons/textWithHeadline";
import { Suspense } from "react";

const dynamic = 'force-dynamic';
const Page = ({params}: { params: { id: number } }) => {
    return <Suspense
        fallback={<Loading/>}><ConfigurationSteps params={params} /></Suspense>;
}
export default Page;
