"use client"
import { FieldSetSelect } from "@iot-portal/frontend/app/common/FieldSet";
import { ModalUI } from "@iot-portal/frontend/app/common/modal";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import * as React from "react";


export const createRelation = (deploymentId: string, linkingComponent: any, relatedComponent: any, relation: any) => {


    fetchAPI(`/api/thingsboard-plugin/deployment/${deploymentId}/${linkingComponent.entityType.split("_")[0].toLowerCase()}/${linkingComponent.id}/relation`, {}, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${Auth.getToken()}`
        },
        body: JSON.stringify({
            toId: relatedComponent.id,
            type: relation.name
        })
    }).then((res) => {
        console.log(res);

    })
};

export const RelationMapField = (p: any) => {

    const {deploymentId, linkingComponent, relation, onChange, ...props } = p;
    const [options, SetOptions] = useState<Array<any>>([]);
    const [value, SetValue] = useState<any>();

    useEffect( () => {
        fetchAPI(`/api/thingsboard-plugin/deployment/${deploymentId}/${relation.component.entityType.split("_")[0].toLowerCase()}/${relation.component.id}/components`, {}, {
            method: "get",
            headers: {
                Authorization: `Bearer ${Auth.getToken()}`
            }
        }).then((res) => {
            SetOptions(res.data);
        })
    }, [deploymentId, relation]);

    useEffect(() => {

        if(value === undefined && options.length > 0) {
            console.log(options[0])
            SetValue(options[0]);
        }
    }, [options]);

    useEffect(() => {
        console.log(value, linkingComponent)
        onChange && onChange(value);
        if(linkingComponent !== undefined && value !== undefined) {
            createRelation(deploymentId, linkingComponent, value, relation);
        }
    }, [value, linkingComponent]);

    return <FieldSetSelect label={relation.displayName} required onChange={(event: any) => SetValue(event.currentTarget.value)} value={value}>
            {
                Array.isArray(options) && options.map((option: any) => {
                    return <option key={option.id.id}
                                   value={option}>{option.label}</option>
                })
            }
    </FieldSetSelect>;
}

export const RelationMappings = ({deploymentId, linkingComponent, relations} : {deploymentId:number,linkingComponent: any, relations: Array<any>}) => {
    return <>
        {
            Array.isArray(relations) && relations.map((relation: any, i, rArray) => {

                return (<>
                    <RelationMapField key={relation.id} deploymentId={deploymentId} linkingComponent={linkingComponent} relation={relation}></RelationMapField>
                </>);
            })
        }
    </>
}

const RelationMappingWindow = (p: any) => {


    const {objectName} = p;

    return <ModalUI name={objectName} onClose={p.onClose}>
        {/*<RelationMapField />*/}
    </ModalUI>;
}

export default RelationMappingWindow;
