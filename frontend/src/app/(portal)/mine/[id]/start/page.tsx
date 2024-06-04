"use client"
import ConfigurationSteps from "@iot-portal/frontend/app/(portal)/mine/[id]/configurationSteps";


const dynamic = 'force-dynamic';
const Page = ({params}: { params: { id: number } }) => {
    return <ConfigurationSteps params={params} />;
}
export default Page;
