import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import { Information, Plus } from "@strapi/icons";
import { useEffect, useState } from "react";
import * as React from "react";
import { Button } from '@strapi/design-system';
import { Simulate } from "react-dom/test-utils";
import { useFetchClient } from '@strapi/helper-plugin';
import load = Simulate.load;

const createCustomerButton = () => {
  const p = useCMEditViewDataManager();

  useEffect(() => {
    console.log(p)
  }, [])

  const { get } = useFetchClient();

  const [ loading, setLoading] = useState(false);

  const create = () => {
      setLoading(true);
    get(`/thingsboard-plugin/firm/${p.initialData.id}/createCustomer`)
      .then((response: any) => {
        console.log(p.layout.attributes.TenentUID.type);
        p.onChange({
          target: { name: "CustomerUID", type: p.layout.attributes.TenentUID.type, value: response.data.CustomerUID }, shouldSetInitialValue: true
        });
        console.log(p);
      }).finally(() => {
        setLoading(false);
    })
  }
  return !p.isCreatingEntry && p.slug === 'api::firm.firm' ? (<Button variant="secondary" startIcon={<Plus />} loading={loading} disabled={ p.initialData.CustomerUID && p.initialData.CustomerUID.length !== 0} onClick={() => create()}>
    Create Portal Customer
  </Button>) : null;
};

export default createCustomerButton;
