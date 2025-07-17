"use client";
import { FieldSetSelect } from "@iot-portal/frontend/app/common/FieldSet";
import { ModalUI } from "@iot-portal/frontend/app/common/modal";
import { fetchAPI } from "@iot-portal/frontend/lib/api";
import { Auth } from "@iot-portal/frontend/lib/auth";
import * as React from "react";
import { useEffect, useState } from "react";

export const createRelation = (
    deploymentId: string,
    linkingComponent: any,
    relatedComponent: any,
    relation: any
) => {
    fetchAPI(
        `/api/thingsboard-plugin/deployment/${deploymentId}/${linkingComponent.entityType.split("_")[0].toUpperCase()}/${linkingComponent.id}/relation`,
        {
            direction: relation.direction
        },
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify({
                toId: relatedComponent.id,
                type: relation.name
            })
        }
    ).then((res) => {

    });
};

export const RelationMapField = (p: any) => {
    const { deploymentId, linkingComponent, relation, onChange, ...props } = p;
    const [options, SetOptions] = useState<Array<any>>([]);
    const [value, SetValue] = useState<any>();

    useEffect(() => {
        fetchAPI(
            `/api/thingsboard-plugin/deployment/${deploymentId}/${relation.component.entityType.split("_")[0].toUpperCase()}/${relation.component.id}/components`,
            {},
            {
                method: "get",
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`
                }
            }
        ).then((res) => {
            SetOptions(res.data);
        });
    }, [deploymentId, relation]);

    useEffect(() => {
        if (value === undefined && options.length > 0) {

            SetValue(options[0]);
        }
    }, [options]);

    useEffect(() => {

        onChange && onChange(value);
        if (linkingComponent !== undefined && value !== undefined) {
            createRelation(deploymentId, linkingComponent, value, relation);
        }
    }, [value, linkingComponent]);

    return (
        <FieldSetSelect
            label={relation.displayName}
            required
            onChange={(event: any) => SetValue(options[event.currentTarget.value])}
            value={props.value}
        >
            {Array.isArray(options) &&
                options.map((option: any, i, a) => {
                    return (
                        <option key={option.id.id} value={i}>
                            {option.label}
                        </option>
                    );
                })}
        </FieldSetSelect>
    );
};

export const RelationMappings = ({
    deploymentId,
    linkingComponent,
    relations,
    onChanges
}: {
    deploymentId: number;
    linkingComponent: any;
    relations: Array<any>;
    onChanges: Function[];
}) => {
    return (
        <>
            {Array.isArray(relations) &&
                relations.map((relation: any, i, rArray) => {
                    return (
                        <>
                            <RelationMapField
                                key={relation.id}
                                deploymentId={deploymentId}
                                linkingComponent={linkingComponent}
                                relation={relation}
                                onChange={onChanges[i]}
                            ></RelationMapField>
                        </>
                    );
                })}
        </>
    );
};

const RelationMappingWindow = (p: any) => {
    const { objectName } = p;

    return (
        <ModalUI name={objectName} onClose={p.onClose}>
            {/*<RelationMapField />*/}
        </ModalUI>
    );
};

export default RelationMappingWindow;
