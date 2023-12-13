/*
 *
 * HomePage
 *
 */

import { ArrowLeft, Check, Layout, Link, Pencil, Plus } from "@strapi/icons";
import React, { useState } from 'react';
import { Box,Grid,GridItem,Flex, HeaderLayout, Button, ModalLayout, TextInput, Card,ContentLayout  } from "@strapi/design-system";
import pluginId from '../../pluginId';

const HomePage = () => {

  const initUrl = 'http://localhost:1337';

  const [url, setUrl] = useState(initUrl);

    return (<Box background="neutral100">
      <HeaderLayout primaryAction={<Button startIcon={<Check />}  disabled={url === initUrl} >
        Save
      </Button>} title="Thingsboard"  as="h2" />
          <ContentLayout>
            <form>
            <Card padding={7} paddingTop={6} paddingBottom={6} >
              <Flex direction="column" gap={4} alignItems={"stretch"}>
                <h2 style={{fontWeight: 500}}>Settings</h2>
                <Grid gap={6}>
                  <GridItem style={{gridColumn: "span 6"}}>
                    <TextInput label={"API-URL"} value={url} onChange={(e: any) => setUrl(e.target.value)} name="api-url" hint={"Defines the URL under which Strapi can reach Thingsboard"} placeholder={"ex: https://plattform.iot4h.de"}></TextInput>
                  </GridItem>
                </Grid>
              </Flex>
            </Card>
            </form>
          </ContentLayout>
    </Box>);
};

export default HomePage;
