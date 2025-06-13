"use client";
import MyDeploymentPage from "@iot-portal/frontend/app/(portal)/(usecases)/mine/[id]/dashboards";

const Page = ({ params }: { params: { id: number } }) => {
    return <MyDeploymentPage params={params} />;
};
export default Page;
