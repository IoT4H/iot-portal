import Step from "@iot-portal/frontend/app/common/setup/step";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import { useCallback, useEffect, useState } from "react";

export default function ConfigurationSteps({params}: { params: { id: number } }) {



    const [steps, SetSteps] = useState<Array<any>>([]);

    useEffect(() => {

        fetchAPI(`/api/thingsboard-plugin/deployment/${params.id}/steps`, {},
            {
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                }
            }).then((response) => {
            SetSteps(response);
        })
    }, []);

    return (
        <div className={"gap-8 flex flex-col"}>
            {
                steps.map((s, index) => {
                    return (<Step key={index} state={true} viewStatus={true} deployment={params.id} data={ Object.assign(s, {index: index + 1 }) } />);
                })
            }
        </div>
    );

}
