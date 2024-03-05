"use client"
import ConfigurationSteps from "@iot-portal/frontend/app/(portal)/mine/[id]/configurationSteps";
import MyDeploymentPage from "@iot-portal/frontend/app/(portal)/mine/[id]/dashboards";


const Page = async ({params}: { params: { id: number } }) => ConfigurationSteps({params});
export default Page;
