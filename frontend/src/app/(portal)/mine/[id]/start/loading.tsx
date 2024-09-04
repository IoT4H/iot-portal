import TextWithHeadline, { StepSkeleton } from "@iot-portal/frontend/app/common/skeletons/textWithHeadline";

export default function Loading() {
    return <>
        <TextWithHeadline />
        <StepSkeleton />
        <StepSkeleton />
        <StepSkeleton />
    </>
}
