import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardContent,
  CardSubtitle,
  CardTitle,
  Crumb,
  EmptyStateLayout,
  Field,
  FieldLabel,
  Flex,
  Grid,
  GridItem,
  KeyboardNavigable,
  Loader,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalLayout,
  Typography
} from "@strapi/design-system";
import { useFetchClient } from "@strapi/helper-plugin";
import { ArrowLeft, ChartBubble, Dashboard, Link, Pencil, Question, Server, User } from "@strapi/icons";
import * as React from "react";
import { useEffect, useState } from "react";

import { useIntl } from "react-intl";
import styled from "styled-components";

const SplittingRegEx = /([A-Z]?[a-z]+|\d+|[A-Z]+)/gm;

const formatter = (s: string) => {
  return s;
};

const IdSpan = styled.span`
  padding-left: 0.5rem;
  font-size: 0.9em;
`;


const TenantSpan = styled.span`
  padding-left: 0.5rem;
  font-size: 0.9em;
`;

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

const Icons = (type: string) => {
  switch (type) {
    case "dashboard":
    case "Dashboard":
    case "DASHBOARD":
      return <Dashboard />;
    case "DeviceProfile":
    case "DEVICE_PROFILE":
      return <Server />;
    case "AssetProfile":
    case "ASSET_PROFILE":
      return <ChartBubble />;
    case "RuleChain":
    case "RULE_CHAIN":
      return <Link />;
    default:
      return <Question />;
  }
};

export const ComponentItem = (e: {
  id?: string;
  type?: string;
  tenant?: {
    id: string;
  }
}) => {

  const { get } = useFetchClient();
  const [displayedName, SetDisplayedName] = useState<string | undefined>(undefined);

  useEffect(() => {
    try {

    get(
      `/thingsboard-plugin/tenant/${e.tenant?.id}/${e.type?.toLowerCase()}/${e.id}`)
      .then((response: any) => {
        SetDisplayedName(response.data.name);
      }).catch((reason: any) => {
      console.warn(reason);
      });
    } catch (e) {
      console.warn(e);
    }
  }, []);

  return (
    <>
      <Card id="tirdth" cursor={"pointer"}>
        <CardBody>
          <Box padding={2} background="primary100">
            {Icons(e.type || "")}
          </Box>
          <CardContent paddingLeft={2}>
            <CardTitle bold>{displayedName || "COMP_NAME"}</CardTitle>
            <CardSubtitle>
              {e.type ? (e.type || "").trim() : "UNDEFINED"}
              <IdSpan>( {e.id || "ID missing"} )</IdSpan>
            </CardSubtitle>
          </CardContent>
        </CardBody>
      </Card>
    </>
  );
};

const singleTBIDInput = React.forwardRef((props, ref) => {

  const {
    // @ts-ignore
    attribute,
    // @ts-ignore
    intlLabel,
    // @ts-ignore
    description,
    children,
    // @ts-ignore
    value,
    // @ts-ignore
    name,
    // @ts-ignore
    onChange,
    // @ts-ignore
    contentTypeUID,
    // @ts-ignore
    type,
    // @ts-ignore
    required,
    // @ts-ignore
    disabled
  } = props; // these are just some of the props passed by the content-manager

  const { formatMessage } = useIntl();

  const getOrgValue = (): any => {
    try {
      return JSON.parse(value) || undefined;
    } catch (e) {
      return undefined;
    }
  };

  const [isVisible, setIsVisible] = useState(false);
  const [selectTenant, setSelectTenant] = useState(true);
  const [selectComponentType, setSelectComponentType] = useState(false);

  const tenantsInit = { data: [] };
  const [tenants, SetTenants] = useState<any>(tenantsInit);
  const [tenantsLoading, SetTenantsLoading] = useState<boolean>(true);
  const componentsInit = { data: [] };

  const [componentTypes, SetComponentTypes] = useState<any>([]);
  const [selectedComponentType, SetSelectedComponentType] = useState<string | undefined>(undefined);

  const [components, SetComponents] = useState<any>(componentsInit);
  const [componentsLoading, SetComponentsLoading] = useState<boolean>(false);

  const [openTenant, SetOpenTenant] = useState<string>("");
  const [errorDisplay, setErrorDisplay] = useState<boolean>(false);

  const [currentValue, SetCurrentValue] = useState<any>(getOrgValue());

  const { get } = useFetchClient();

  useEffect(() => {
    SetCurrentValue(getOrgValue());
    setSelectTenant(true);
  }, []);

  const confirmChange = () => {
    onChange({
      target: {
        name,
        type: attribute.type,
        value: JSON.stringify(currentValue)
      }
    });
  };

  const setNewValue = (value: any) => {
    SetCurrentValue(value);
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      SetTenants(tenantsInit);
      SetTenantsLoading(true);
      setErrorDisplay(false);
      get("/thingsboard-plugin/tenants", { params: { page: 0, pageSize: 30 } })
        .then((response: any) => {
          SetTenants(response.data);
        })
        .catch((e: any) => {
          setErrorDisplay(true);
        })
        .finally(() => {
          SetTenantsLoading(false);
        });
    }
  }, [selectTenant, isVisible]);

  useEffect(() => {
    if (selectedComponentType !== undefined) {
      SetComponents(componentsInit);
      SetComponentsLoading(true);
      openTenant.length !== 0 &&
      get(
        `/thingsboard-plugin/tenant/${openTenant}/${selectedComponentType.toLowerCase()}`,
        {
          params: {
            page: 0,
            pageSize: 30
          }
        }
      )
        .then((response: any) => {
          SetComponents(response.data);
        })
        .finally(() => {
          SetComponentsLoading(false);
        });
    }
  }, [openTenant, selectedComponentType]);

  useEffect(() => {
    if (openTenant) {
      if (componentTypes.length > 1) {
        setSelectComponentType(true);
      } else {
        SetSelectedComponentType(componentTypes[0] || undefined);
        setSelectComponentType(false);
      }
    }
  }, [openTenant]);

  useEffect(() => {
    if (isVisible) {
      SetCurrentValue(getOrgValue());
      SetTenants(tenantsInit);
      SetComponents(componentsInit);
      setSelectTenant(true);
    }
  }, [isVisible]);

  useEffect(() => {
    confirmChange();
  }, [currentValue]);

  useEffect(() => {
    console.warn(attribute);
    const a: Array<string> = new Array<string>();

    if (attribute.options.types.Dashboard || true) {
      a.push("Dashboard");
    }

    if (attribute.options.types.AssetProfile || true) {
      a.push("AssetProfile");
    }

    if (attribute.options.types.DeviceProfile || true) {
      a.push("DeviceProfile");
    }

    if (attribute.options.types.RuleChain || true) {
      a.push("RuleChain");
    }

    SetComponentTypes(a);
  }, [attribute]);

  const currentSelectionContains = (id: string) => {
    return currentValue.findIndex((value: any) => value.id === id) !== -1;
  };

  const backButton = () => {
    if (selectedComponentType) {
      SetSelectedComponentType(undefined);
      setSelectComponentType(true);
    } else {
      setSelectTenant(true);
    }
  };

  return (
    <>
      <ErrorBoundary>
        <Field>
          <FieldLabel style={{ paddingBottom: "4px" }}>
            {" "}
            {formatMessage(intlLabel)}
          </FieldLabel>
          {getOrgValue() !== undefined ? (
            <div onClick={() => setIsVisible(true)}>
              <ComponentItem
                id={getOrgValue().id}
                type={getOrgValue().entityType}
                tenant={{ id: getOrgValue().tenantId.id }}
              />
            </div>
          ) : (
            <EmptyStateLayout
              content="Es wurde bisher keine Auswahl getroffen."
              action={
                !disabled && (
                  <Button
                    variant="secondary"
                    startIcon={<Pencil />}
                    onClick={() => setIsVisible(true)}
                  >
                    Auswahl treffen
                  </Button>
                )
              }
            />
          )}
          {description && (
            <Typography style={{ paddingTop: "4px" }} as="h5">
              <Typography style={{ fontSize: "0.75rem", color: "#666687" }}>
                {formatMessage(description)}
              </Typography>
            </Typography>
          )}
        </Field>

        {isVisible && (
          <ModalLayout
            onClose={() => setIsVisible((prev) => !prev)}
            labelledBy="title"
          >
            <ModalHeader>
              <Typography as="h2">
                <Typography
                  fontWeight="bold"
                  textColor="neutral800"
                  id="title"
                  style={{ paddingRight: "0.5rem" }}
                >
                  Choose{" "}
                  {selectedComponentType &&
                    selectedComponentType
                      .split(SplittingRegEx)
                      .join(" ")
                      .trim() + "s"}{" "}
                  from Thingsboard
                </Typography>
              </Typography>
            </ModalHeader>
            <ModalBody>
              <Flex gap={3} paddingBottom={6}>
                <Breadcrumbs>
                  <Crumb>Select</Crumb>
                  <Crumb>
                    <span
                      style={{ cursor: "pointer !important" }}
                      onClick={() => setSelectTenant(true)}
                    >
                      Tenant
                    </span>
                  </Crumb>
                  {(selectComponentType || selectedComponentType) && (
                    <Crumb>Type</Crumb>
                  )}
                  {!selectTenant &&
                    !selectComponentType &&
                    selectedComponentType && (
                      <Crumb>
                        {selectedComponentType
                          .split(SplittingRegEx)
                          .join(" ")
                          .trim() + "s"}
                      </Crumb>
                    )}
                </Breadcrumbs>
              </Flex>
              {(selectTenant && tenantsLoading) ||
              (!selectTenant && !selectComponentType && componentsLoading) ? (
                <Flex
                  alignItems={"center"}
                  justifyContent={"center"}
                  direction={"row"}
                >
                  <Loader>Loading content...</Loader>
                </Flex>
              ) : (
                <Grid gap={3} col={12}>
                  {selectTenant ? (
                    tenants.data.map((t: any, index: number) => {
                      return (
                        <GridItem col={6}>
                          <Card
                            key={`box-${index}`}
                            background="neutral100"
                            cursor={"pointer"}
                            onClick={() => {
                              setSelectTenant(false);
                              SetOpenTenant(t.id.id);
                            }}
                          >
                            <CardBody>
                              <Box padding={2} background="primary100">
                                <User />
                              </Box>
                              <CardContent paddingLeft={2}>
                                <CardTitle>{t.name}</CardTitle>
                                <CardSubtitle>{t.id.id}</CardSubtitle>
                              </CardContent>
                              <Box padding={2} marginLeft={"auto"}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  width={"1rem"}
                                  height={"1rem"}
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </Box>
                            </CardBody>
                          </Card>
                        </GridItem>
                      );
                    })
                  ) : (
                    <></>
                  )}

                  {!selectTenant &&
                    !selectComponentType &&
                    components.data.map((c: any, index: number) => {
                      return (
                        <GridItem col={6}>
                          <KeyboardNavigable>
                            <Card
                              key={`box-${index}`}
                              background="neutral100"
                              cursor={"pointer"}
                              onClick={() => {
                                setNewValue(
                                  Object.assign(c.id, {
                                    tenantId: { id: openTenant }
                                  })
                                );
                              }}
                            >
                              <CardBody marginLeft={6}>
                                <CardContent paddingRight={2}>
                                  <CardTitle>{c.name}</CardTitle>
                                  <CardSubtitle>{c.id.id}</CardSubtitle>
                                </CardContent>
                              </CardBody>
                            </Card>
                          </KeyboardNavigable>
                        </GridItem>
                      );
                    })}

                  {!selectTenant &&
                    selectComponentType &&
                    componentTypes.map((c: any, index: number) => {
                      return (
                        <GridItem col={6}>
                          <KeyboardNavigable>
                            <Card
                              key={`box-${index}`}
                              background="neutral100"
                              cursor={"pointer"}
                              onClick={() => {
                                SetSelectedComponentType(c);
                                setSelectComponentType(false);
                              }}
                            >
                              <CardBody>
                                <Box padding={2} background="primary100">
                                  {Icons(c)}
                                </Box>
                                <CardContent paddingLeft={2}>
                                  <CardTitle>{c}</CardTitle>
                                </CardContent>
                                <Box padding={2} marginLeft={"auto"}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    width={"1rem"}
                                    height={"1rem"}
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </Box>
                              </CardBody>
                            </Card>
                          </KeyboardNavigable>
                        </GridItem>
                      );
                    })}

                  {((!selectTenant &&
                      !selectComponentType &&
                      components.data.length === 0) ||
                    (selectTenant && tenants.data.length === 0)) && (
                    <GridItem col={12}>
                      <EmptyStateLayout
                        content={
                          errorDisplay
                            ? "Es ist ein Fehler aufgetreten."
                            : "Es wurde nichts gefunden."
                        }
                        padddingTop={3}
                        paddingBottom={3}
                      />
                    </GridItem>
                  )}
                </Grid>
              )}
            </ModalBody>
            <ModalFooter
              startActions={
                <>
                  <Button
                    variant="tertiary"
                    startIcon={
                      <ArrowLeft
                        height={"1em"}
                        width={"1em"}
                        cursor={"pointer"}
                      />
                    }
                    onClick={() => backButton()}
                    disabled={selectTenant}
                  >
                    Zurück
                  </Button>
                </>
              }
            />
          </ModalLayout>
        )}
      </ErrorBoundary>
    </>
  );
});

export default singleTBIDInput;
