import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import { Information, Plus } from "@strapi/icons";
import { useState } from "react";
import * as React from "react";
import { Button } from '@strapi/design-system';
import { Simulate } from "react-dom/test-utils";
import load = Simulate.load;

const createTenantButton = () => {
  const p = useCMEditViewDataManager();


  const [ loading, setLoading] = useState(false);

  const create = () => {
      setLoading(true);
  }
  return !p.isCreatingEntry && p.slug === 'api::firm.firm' ? (<Button variant="secondary" startIcon={<Plus />} loading={loading} disabled={ p.initialData.TenentUID && p.initialData.TenentUID.length !== 0} onClick={create}>
    Create Tenant Account
  </Button>) : null;
};

export default createTenantButton;
