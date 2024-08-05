"use client"
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import { useRouter } from 'next/navigation';

const dynamic = 'force-dynamic';

const Page = ({params}: { params: { id: number } }) => {


    const router = useRouter();


    fetchAPI(`/api/thingsboard-plugin/deployment/${params.id}/steps/progress`, {},
        {
            headers: {
                Authorization: `Bearer ${Auth.getToken()}`
            }
        }).then((response) => {
            if(response.progress && response.progress >= 100) {
                router.push('dashboards');
            } else {
                router.push('start');
            }
    })

}
export default Page;
