"use client"
import { Deployment, ListDeployments, ListItemDeployment } from "@iot-portal/frontend/app/(portal)/deployments";
import { fetchAPI } from '@iot-portal/frontend/lib/api'
import { Auth } from "@iot-portal/frontend/lib/auth";
import { useCallback, useEffect, useState } from "react";


const dynamic = 'force-dynamic';

export default function Mine() {


    const [deployments, SetDeployments] = useState<Deployment[]>();


    const poll = useCallback(() => {

        fetchAPI('/api/thingsboard-plugin/deployments', {}, {
            headers: {
                Authorization: `Bearer ${Auth.getToken()}`
            }
        }).then((response) => {
            SetDeployments(response);
        }, (err) => {
            console.error(err);
        }).finally(() => {


            setTimeout(() => poll(), 1000);
        });
    }, []);

    useEffect(() => {


        poll();



    }, []);


    return (
        <div className="flex flex-row content-stretch gap-12">
            <ListDeployments title={"Meine Use-Cases"}>
                {
                    deployments && deployments.length > 0 && deployments.map((u: any) =>
                        <ListItemDeployment key={u.id} deployment={u}/>
                    )
                }
            </ListDeployments>
        </div>
    );
}
