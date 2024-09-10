"use client"
import { tr } from "@faker-js/faker";
import { State } from "@iot-portal/frontend/app/(portal)/deployment-status";
import { Deployment, ListDeployments, ListItemDeployment } from "@iot-portal/frontend/app/(portal)/deployments";
import { fetchAPI } from '@iot-portal/frontend/lib/api'
import { Auth } from "@iot-portal/frontend/lib/auth";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";


const dynamic = 'force-dynamic';

export default function Mine() {


    const [deployments, SetDeployments] = useState<Deployment[]>();

    const [loading, SetLoading] = useState<boolean>(false);

    const poll = useCallback(() => {
        SetLoading(true);
        fetchAPI('/api/thingsboard-plugin/deployments', {}, {
            headers: {
                Authorization: `Bearer ${Auth.getToken()}`
            }
        }).then((response) => {
            SetDeployments(response);
            SetLoading(false);
        });

    }, [Auth.getToken()]);

    useEffect(() => {
        poll();
    }, []);

    useEffect(() => {
        if(Array.isArray(deployments) && !loading) {
            setTimeout(poll, 1000);
        }
    }, [deployments, loading]);


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
