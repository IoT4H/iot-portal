import { ContentBox } from "@strapi/helper-plugin";
import axios from "axios";
import { UUID } from "crypto";
import { useEffect, useState } from "react";
import * as React from "react";

import { useIntl } from "react-intl";
import { TextInput } from "@strapi/design-system"
import { Grid, GridItem } from '@strapi/design-system';
import { ModalLayout, ModalBody, ModalHeader, ModalFooter } from '@strapi/design-system';
import { useFetchClient } from '@strapi/helper-plugin';
import { Field, FieldLabel, FieldHint, FieldError, FieldInput, FieldAction } from '@strapi/design-system';
import {
  Dots,
  NextLink,
  PageLink,
  Pagination,
  PreviousLink,
  Card,
  CardHeader,
  CardBody,
  CardCheckbox,
  CardAction,
  CardAsset,
  CardTimer,
  CardContent,
  CardBadge,
  CardTitle,
  CardSubtitle,
  Button,
  Box,
  IconButton,
  KeyboardNavigable,
  Typography,
  Flex,
  Breadcrumbs,
  Link as LinkButton,
  Crumb,
  Loader,
} from '@strapi/design-system';
import { EmptyStateLayout } from '@strapi/design-system';
import {
  Plus,
  Pencil,
  Trash,
  Dashboard,
  Link,
  ChartBubble,
  Server,
  CollectionType,
  User,
  ArrowLeft
} from '@strapi/icons';
import { NavLink } from "react-router-dom";


const TBIDInput = React.forwardRef((props, ref) => {
  // @ts-ignore
  const { attribute, label, children,value,  name, onChange, contentTypeUID, type, required, disabled } =
    props; // these are just some of the props passed by the content-manager

  const { formatMessage } = useIntl();

  // @ts-ignore



  function Icons(type: string) {
    switch(attribute.options.type) {
      case "Dashboard":
        return <Dashboard />;
      case "DeviceProfile":
        return <Server />;
      case "AssetProfile":
        return <ChartBubble />;
      case "RuleChain":
        return <Link />;
    }
  }

  const getOrgValue = (): any[] => value ? JSON.parse(value) : [];

  const [isVisible, setIsVisible] = useState(false);
  const [selectTenant, setSelectTenant] = useState(true);

  const tenantsInit = { data: []};
  const [tenants, SetTenants] = useState<any>(tenantsInit);
  const [tenantsLoading, SetTenantsLoading] = useState<boolean>(true);
  const componentsInit = { data: []};
  const [components, SetComponents] = useState<any>(componentsInit);
  const [componentsLoading, SetComponentsLoading] = useState<boolean>(true);

  const [openTenant, SetOpenTenant] = useState<string>("");

  const [currentValue, SetCurrentValue] = useState(getOrgValue());

  useEffect(() => {

    SetCurrentValue(getOrgValue());
    setSelectTenant(true);
  }, [])

  const confirmChange = () => {
    onChange({
      target: { name, type: attribute.type, value: JSON.stringify(currentValue) },
    });
  }

  useEffect(() => {
    if(isVisible) {
      SetTenants(tenantsInit);
      SetTenantsLoading(true);
      axios
        .get("http://localhost:1337/thingsboard-plugin/tenants", {params: {page: 0, pageSize: 30}})
        .then((response) => {
          SetTenants(response.data);
        }).finally(() => {
        SetTenantsLoading(false);
      });
    }
  }, [selectTenant, isVisible])

  useEffect(() => {
    SetComponents(componentsInit);
    SetComponentsLoading(true);
    openTenant.length !== 0 && axios
      .get(`http://localhost:1337/thingsboard-plugin/tenant/${openTenant}/${attribute.options.type.toLowerCase()}`, { params: { page: 0, pageSize: 30} })
      .then((response) => {
        SetComponents(response.data);
      }).finally(() => {
        SetComponentsLoading(false);
      });
  }, [openTenant])

  useEffect(() => {
    if(isVisible) {
      SetCurrentValue(getOrgValue());
      SetTenants(tenantsInit);
      SetComponents(componentsInit);
      setSelectTenant(true);
    }
  }, [isVisible])

  useEffect(() => {
    console.log(currentValue);
  }, [currentValue])

  const currentSelectionContains = (id: UUID) => { return currentValue.findIndex((value) => value.id === id) !== -1};

  return (
  <>
      <KeyboardNavigable >
        <Grid gap={"1rem"} col={12}>
        {
          getOrgValue().map((e: { id: string, type: string}) => {
            return (
              <GridItem col={6}>
              <Card id="tirdth">
                <CardBody>
                  <Box padding={2} background="primary100">
                    {
                      Icons(attribute.options.type)
                    }
                  </Box>
                  <CardContent paddingLeft={2}>
                    <CardTitle>{ attribute.options.type.split(/([A-Z][a-z]*|[0-9]+)/g).join(" ").trim() }</CardTitle>
                    <CardSubtitle>{ e.id }</CardSubtitle>
                  </CardContent>
                  <CardAction>
                    <button>TEst</button>
                  </CardAction>
                </CardBody>
              </Card>
              </GridItem>
              );
          })
        }
          {
            getOrgValue().length === 0 && (<GridItem col={12}>
              <EmptyStateLayout content="Es wurde bisher keine Auswahl getroffen." padddingTop={3} paddingBottom={3} />
            </GridItem>)
          }
        </Grid>
    </KeyboardNavigable>
    <Box marginTop={6}>
      <Button fullWidth  variant="secondary" startIcon={<Pencil />} onClick={() => setIsVisible(prev => !prev)}>
        Auswahl bearbeiten
      </Button>
    </Box>



    {isVisible && <ModalLayout onClose={() => setIsVisible(prev => !prev)} labelledBy="title">
      <ModalHeader>
        <Typography as="h2">
          <Typography fontWeight="bold" textColor="neutral800" id="title" style={{paddingRight: '0.5rem'}}>
            Choose { attribute.options.type.split(/([A-Z][a-z]*|[0-9]+)/g).join(" ").trim() + "s" } from Thingsboard
          </Typography>
          <Typography textColor="neutral700">
           ({currentValue.length } { attribute.options.type.split(/([A-Z][a-z]*|[0-9]+)/g).join(" ").trim() + "s" } selected)
          </Typography>
        </Typography>
      </ModalHeader>
      <ModalBody>
        <Flex gap={3} paddingBottom={6} >
          <Breadcrumbs>
            <Crumb>Select</Crumb>
            <Crumb><span style={{cursor: "pointer !important"}} onClick={() => setSelectTenant(true)}>Tenant</span></Crumb>
            { !selectTenant && <Crumb>{ attribute.options.type.split(/([A-Z][a-z]*|[0-9]+)/g).join(" ").trim() + "s" }</Crumb> }
          </Breadcrumbs>
        </Flex>
        {
          (selectTenant && tenantsLoading || !selectTenant && componentsLoading) ?
            <Flex alignItems={"center"}  justifyContent={"center"} direction={"row"}><Loader>Loading content...</Loader></Flex> :
          ( <Grid gap={3} col={12}>
          {selectTenant && tenants.data.map((t: any, index: number) => {
            return (
              <GridItem col={6}>
                <Card key={`box-${index}`} background="neutral100" cursor={"pointer"} onClick={() => {
                  setSelectTenant(false);
                  SetOpenTenant(t.id.id)
                }}>
                  <CardBody>
                    <Box padding={2} background="primary100">
                      <User />
                    </Box>
                    <CardContent paddingLeft={2}>
                      <CardTitle>{ t.title }</CardTitle>
                      <CardSubtitle>{ t.id.id }</CardSubtitle>
                    </CardContent>
                    <Box padding={2} marginLeft={"auto"}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={"1rem"} height={"1rem"}>
                        <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                      </svg>
                    </Box>
                  </CardBody>
                </Card>
              </GridItem>
            );
          })}

          {!selectTenant && components.data.map((c: any, index: number) => {
            return (
              <GridItem col={6}>
                <Card key={`box-${index}`} background="neutral100">
                  <CardHeader>
                    <CardCheckbox onClick={() => {
                      currentSelectionContains(c.id.id) ? SetCurrentValue(currentValue.filter((e: any) => e.id != c.id.id)) : SetCurrentValue([...currentValue, c.id])
                    }} checked={currentSelectionContains(c.id.id)}></CardCheckbox>
                  </CardHeader>
                  <CardBody marginLeft={6}>
                    <CardContent paddingRight={2}>
                      <CardTitle>{ c.title }</CardTitle>
                      <CardSubtitle>{ c.id.id }</CardSubtitle>
                    </CardContent>
                  </CardBody>
                </Card>
              </GridItem>
            );
          })}

            {(!selectTenant && components.data.length === 0 || selectTenant && tenants.data.length === 0) &&
              (<GridItem col={12}>
                <EmptyStateLayout content="Es wurde nichts gefunden." padddingTop={3} paddingBottom={3} />
              </GridItem>)
            }
        </Grid> )
        }
      </ModalBody>
      <ModalFooter startActions={
        <>
          <Button variant="tertiary"  startIcon={<ArrowLeft height={"1em"} width={"1em"}  cursor={"pointer"} /> } onClick={() => setSelectTenant(true)} disabled={selectTenant}>
            Zurück
          </Button>
        </>
      } endActions={<>
        <Button onClick={() => { confirmChange(); setIsVisible(prev => !prev);}}>Übernehmen</Button>
      </>} />
    </ModalLayout>}
  </>
  );
});

export default TBIDInput;
