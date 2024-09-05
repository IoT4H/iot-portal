import { useEffect, useState } from "react";
import * as React from "react";

import { Grid, GridItem, Field, FieldLabel, Box, Flex, EmptyStateLayout } from '@strapi/design-system';
import { useFetchClient } from '@strapi/helper-plugin';
import { ComponentItem } from "./SingleThingsboardComponent";
import { ComponentStructure } from "./ComponentStructure"


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



const ComponantLinkItem  = ({link} : {link: ComponentStructure}) => {



  return (
    <>
      <GridItem col={12}>
        <Flex gap={"8"} justifyContent={"center"}>
          {link.template ? <ComponentItem id={link.template.id} type={link.template.entityType} /> : <ComponentItem id={"Template Reference missing"} type={undefined} />}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" height={"3em"} >
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"/>
          </svg>
          {link && <ComponentItem id={link.id} type={link.entityType} />}
        </Flex>
      </GridItem>
    </>
  );
}


const TBIDInput = React.forwardRef((props, ref) => {
  // @ts-ignore
  const { attribute, label, children,value,  name, onChange, contentTypeUID, type, required, disabled } =
    props; // these are just some of the props passed by the content-manager

  const getOrgValue = (): any[] => {
    try {
      return JSON.parse(value) || [];
    } catch (e) {
      return [];
    }
  };

  const [currentValue, SetCurrentValue] = useState(getOrgValue());

  const { get } = useFetchClient();

  useEffect(() => {
    SetCurrentValue(getOrgValue());
  }, [])

  const confirmChange = () => {
    onChange({
      target: { name, type: attribute.type, value: JSON.stringify(currentValue) },
    });
  }

  const currentSelectionContains = (id: string) => { return currentValue.findIndex((value) => value.id === id) !== -1};

  return (
  <>
    <ErrorBoundary>
      <Field>
        <FieldLabel>{ label || name }</FieldLabel>
        <Box>
        <Grid gap={"2rem"} col={12}>
        {
          getOrgValue().map((link: ComponentStructure) => {
            return (<ComponantLinkItem key={link.id} link={link} />);
          })
        }
          {
            getOrgValue().length === 0 && (<GridItem col={12}>
              <EmptyStateLayout content="Bisher wurden keine Componenten deployed." padddingTop={3} paddingBottom={3} />
            </GridItem>)
          }
        </Grid>
        </Box>
      </Field>
    </ErrorBoundary>
  </>
  );
});

export default TBIDInput;


