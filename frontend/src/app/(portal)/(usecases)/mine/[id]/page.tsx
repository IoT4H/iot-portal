"use client"
import MyDeploymentPage from "@iot-portal/frontend/app/(portal)/(usecases)/mine/[id]/dashboards";
import ConfigurationSteps from "@iot-portal/frontend/app/(portal)/(usecases)/mine/[id]/configurationSteps";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import { useRouter } from 'next/navigation';

const dynamic = 'force-dynamic';

const Page = ({params}: { params: { id: number } }) => {


    const router = useRouter();


    fetchAPI(`/api/thingsboard-plugin/deployment/${params.id}/steps/progressComplete`, {},
        {
            headers: {
                Authorization: `Bearer ${Auth.getToken()}`
            }
        }).then((response) => {
            if(response.complete) {
                router.replace('dashboards');
                return <MyDeploymentPage params={params} />;
            } else {
                router.replace('start');
                return <ConfigurationSteps params={params} />;
            }
    })

}
export default Page;
