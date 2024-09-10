import { ContentBox } from "@strapi/helper-plugin";
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
import { ComponentItem } from "./SingleThingsboardComponent";


const SplittingRegEx = /([A-Z]?[a-z]+|\d+|[A-Z]+)/gm;

const formatter = (s: string) => {
  return s
}


class ErrorBoundary extends React.Component {

  state: any;
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const GridComponantItem  = (e: { id: string, type: string}) => {
  return (
    <>
      <GridItem col={6}>
        <ComponentItem id={e.id} type={e.type} key={e.id} />
      </GridItem>
    </>
  );
}


const TBIDInput = React.forwardRef((props, ref) => {
  // @ts-ignore
  const { attribute, label, children,value,  name, onChange, contentTypeUID, type, required, disabled } =
    props; // these are just some of the props passed by the content-manager

  const { formatMessage } = useIntl();



  const getOrgValue = (): any[] => {
    try {
      return JSON.parse(value) || [];
    } catch (e) {
      return [];
    }
  };

  const [isVisible, setIsVisible] = useState(false);
  const [selectTenant, setSelectTenant] = useState(true);

  const tenantsInit = { data: []};
  const [tenants, SetTenants] = useState<any>(tenantsInit);
  const [tenantsLoading, SetTenantsLoading] = useState<boolean>(true);
  const componentsInit = { data: []};
  const [components, SetComponents] = useState<any>(componentsInit);
  const [componentsLoading, SetComponentsLoading] = useState<boolean>(true);

  const [openTenant, SetOpenTenant] = useState<string>("");
  const [errorDisplay, setErrorDisplay] = useState<boolean>(false);

  const [currentValue, SetCurrentValue] = useState(getOrgValue());

  const { get } = useFetchClient();

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
      setErrorDisplay(false);
      get("/thingsboard-plugin/tenants", {params: {page: 0, pageSize: 30}})
        .then((response: any) => {
          SetTenants(response.data);
        }).catch((e: any) => {
          setErrorDisplay(true);
        }).finally(() => {
          SetTenantsLoading(false);
        }
      );
    }
  }, [selectTenant, isVisible])

  useEffect(() => {
    SetComponents(componentsInit);
    SetComponentsLoading(true);
    openTenant.length !== 0 &&
    get(`/thingsboard-plugin/tenant/${openTenant}/${attribute.options.type.toLowerCase()}`, { params: { page: 0, pageSize: 30} })
      .then((response: any) => {
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

  const currentSelectionContains = (id: string) => { return currentValue.findIndex((value) => value.id === id) !== -1};

  return (
  <>
    <ErrorBoundary>
      <Field name={ label } >
      <KeyboardNavigable >
        <Grid gap={"1rem"} col={12}>
        {
          getOrgValue().map((e: { id: string, entityType: string}) => {
            return (<GridComponantItem id={e.id} type={e.entityType} />);
          })
        }
          {
            getOrgValue().length === 0 && (<GridItem col={12}>
              <EmptyStateLayout content="Es wurde bisher keine Auswahl getroffen." padddingTop={3} paddingBottom={3} />
            </GridItem>)
          }
        </Grid>
    </KeyboardNavigable>
      </Field>
      { !disabled && (<Box marginTop={6}>
      <Button fullWidth  variant="secondary" startIcon={<Pencil />} onClick={() => setIsVisible(prev => !prev)}>
        Auswahl bearbeiten
      </Button>
    </Box> ) }



    {isVisible && <ModalLayout onClose={() => setIsVisible(prev => !prev)} labelledBy="title">
      <ModalHeader>
        <Typography as="h2">
          <Typography fontWeight="bold" textColor="neutral800" id="title" style={{paddingRight: '0.5rem'}}>
            Choose { attribute.options.type.split(SplittingRegEx).join(" ").trim() + "s" } from Thingsboard
          </Typography>
          <Typography textColor="neutral700">
           ({currentValue.length } { attribute.options.type.split(SplittingRegEx).join(" ").trim() + "s" } selected)
          </Typography>
        </Typography>
      </ModalHeader>
      <ModalBody>
        <Flex gap={3} paddingBottom={6} >
          <Breadcrumbs>
            <Crumb>Select</Crumb>
            <Crumb><span style={{cursor: "pointer !important"}} onClick={() => setSelectTenant(true)}>Tenant</span></Crumb>
            { !selectTenant && <Crumb>{ attribute.options.type.split(SplittingRegEx).join(" ").trim() + "s" }</Crumb> }
          </Breadcrumbs>
        </Flex>
        {
          (selectTenant && tenantsLoading || !selectTenant && componentsLoading) ?
            <Flex alignItems={"center"}  justifyContent={"center"} direction={"row"}><Loader>Loading content...</Loader></Flex> :
          ( <Grid gap={3} col={12}>

          {selectTenant ? tenants.data.map((t: any, index: number) => {
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
                      <CardTitle>{ t.name }</CardTitle>
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
          }) : <></>
          }

          {!selectTenant && components.data.map((c: any, index: number) => {
            return (
              <GridItem col={6}>
                <Card key={`box-${index}`} background="neutral100">
                  <CardHeader>
                    <CardCheckbox onClick={() => {
                      currentSelectionContains(c.id.id) ? SetCurrentValue(currentValue.filter((e: any) => e.id != c.id.id)) : SetCurrentValue([...currentValue, Object.assign(c.id, {"tenantId": { "id" : openTenant}})])
                    }} checked={currentSelectionContains(c.id.id)}></CardCheckbox>
                  </CardHeader>
                  <CardBody marginLeft={6}>
                    <CardContent paddingRight={2}>
                      <CardTitle>{ c.name }</CardTitle>
                      <CardSubtitle>{ c.id.id }</CardSubtitle>
                    </CardContent>
                  </CardBody>
                </Card>
              </GridItem>
            );
          })}

            {(!selectTenant && components.data.length === 0 || selectTenant && tenants.data.length === 0) &&
              (<GridItem col={12}>
                <EmptyStateLayout content={errorDisplay ? "Es ist ein Fehler aufgetreten." : "Es wurde nichts gefunden."} padddingTop={3} paddingBottom={3} />
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
    </ErrorBoundary>
  </>
  );
});

export default TBIDInput;


