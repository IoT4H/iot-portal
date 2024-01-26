import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import { Information, Plus } from "@strapi/icons";
import { useEffect, useState } from "react";
import * as React from "react";
import { Button } from '@strapi/design-system';
import { Simulate } from "react-dom/test-utils";
import { useFetchClient } from '@strapi/helper-plugin';
import load = Simulate.load;

const createTenantButton = () => {
  const p = useCMEditViewDataManager();

  useEffect(() => {
    console.log(p)
  }, [])

  const { get } = useFetchClient();

  const [ loading, setLoading] = useState(false);

  const create = () => {
      setLoading(true);
    get(`/thingsboard-plugin/firm/${p.initialData.id}/createTenant`)
      .then((response: any) => {
        console.log(p.layout.attributes.TenentUID.type);
        p.onChange({
          target: { name: "TenentUID", type: p.layout.attributes.TenentUID.type, value: response.data.TenentUID }, shouldSetInitialValue: true
        });
        console.log(p);
      }).finally(() => {
        setLoading(false);
    })
  }
  return !p.isCreatingEntry && p.slug === 'api::firm.firm' ? (<Button variant="secondary" startIcon={<Plus />} loading={loading} disabled={ p.initialData.TenentUID && p.initialData.TenentUID.length !== 0} onClick={() => create()}>
    Create Tenant Account
  </Button>) : null;
};

export default createTenantButton;
