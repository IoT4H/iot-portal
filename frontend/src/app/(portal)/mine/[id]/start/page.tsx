"use client"
import ConfigurationSteps from "@iot-portal/frontend/app/(portal)/mine/[id]/configurationSteps";
import TextWithHeadline, { StepSkeleton } from "@iot-portal/frontend/app/common/skeletons/textWithHeadline";
import { Suspense } from "react";

const dynamic = 'force-dynamic';
const Page = ({params}: { params: { id: number } }) => {
    return <Suspense
        fallback={
            <>
                <TextWithHeadline />
                <StepSkeleton />
                <StepSkeleton />
                <StepSkeleton />
            </>
        }><ConfigurationSteps params={params} /></Suspense>;
}
export default Page;
