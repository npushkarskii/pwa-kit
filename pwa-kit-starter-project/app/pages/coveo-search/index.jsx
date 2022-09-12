/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useHistory, useParams } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import ProductTile, {
  Skeleton as ProductTileSkeleton,
} from "../../components/product-tile";
import { CloseIcon } from "@chakra-ui/icons";
// Components
import {
  Box,
  Flex,
  SimpleGrid,
  Grid,
  Select,
  Text,
  FormControl,
  Stack,
  useDisclosure,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Link,
  useMultiStyleConfig,
  AspectRatio,
  Heading,
} from "@chakra-ui/react";

// Icons
import { FilterIcon, ChevronDownIcon } from "../../components/icons";

// Constants
import { EngineContext } from "../../components/_app";
import { buildSearchEngine, loadFieldActions, AtomicResultList, AtomicSearchInterface } from "@coveo/atomic-react";
import ProductCard from "./product-card";


const CoveoSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [resultsList, setResultsList] = useState([]);
  const [isLoadingResultsList, setIsLoadingResultsList] = useState(false);

  const engine = buildSearchEngine({
    configuration: {
      accessToken: "xx048a95cc-60a2-4bc0-ade1-fd2b24dc8870",
      organizationId: "barcagroupproductionkwvdy6lp",
      search : {
        pipeline : 'Sports'
      }
    }
  });
  const fieldActions =  loadFieldActions(engine);
  engine.dispatch(fieldActions.registerFieldsToInclude("ec_name,ec_price,ec_images,ec_productid,sf_c_currency,sf_c_image,sf_c_price,title,uri".split(",")));

  useEffect(() => {
    const unsub = engine.subscribe(() => {
      setSearchQuery(engine?.state?.query?.q);
      setResultsList(engine.state?.search?.results);
      setIsLoadingResultsList(engine.state?.search?.isLoading);
    });

    return () => unsub();
  }, [engine.state?.query?.q]);

  return (
    <>
      <div id="coveo-search-page">
        <style>{myStyles}</style>

        <Box
          className="sf-product-list-page"
          data-testid="sf-product-list-page"
          layerStyle="page"
          paddingTop={{ base: 6, lg: 8 }}
        >
          <Stack
            display={{ base: "none", lg: "flex" }}
            direction="row"
            justify="flex-start"
            align="flex-start"
            spacing={4}
            marginBottom={6}
          >
            <Flex align="left" width="287px">
              <Heading as="h2" size="lg" marginLeft={5} paddingTop={10}>
                {searchQuery}
              </Heading>
            </Flex>

            <Box flex={1}  paddingTop={"45px"} justifyContent={'flex-end'} display={'flex'}>
              <atomic-sort-dropdown>
                <atomic-sort-expression
                  label="relevance"
                  expression="relevancy"
                ></atomic-sort-expression>
                <atomic-sort-expression
                  label="Price low to high"
                  expression="ec_price ascending"
                ></atomic-sort-expression>
                <atomic-sort-expression
                  label="Price high to low"
                  expression="ec_price descending"
                ></atomic-sort-expression>
              </atomic-sort-dropdown>
            </Box>
          </Stack>

          {/* Body  */}
          <atomic-no-results></atomic-no-results>
          <Grid
            templateColumns={{ base: "1fr", md: "280px 1fr" }}
            columnGap={6}
          >
            <Stack display={{ base: "none", md: "flex" }}>
              <atomic-facet-manager>
                <atomic-numeric-facet
                  field="ec_price"
                  label="Price"
                  number-of-values={5}
                  range-algorithm="even"
                  filter-facet-count={false}
                  facet-id="price-facet"
                ></atomic-numeric-facet>
                <atomic-facet
                  field="year"
                  label="Year"
                  facet-id="year-facet"
                ></atomic-facet>
              </atomic-facet-manager>
            </Stack>
            <Box>
              <Box marginY={3}>
                <atomic-breadbox></atomic-breadbox>
              </Box>
              <Box marginY={3}>
                <atomic-did-you-mean></atomic-did-you-mean>
              </Box>
              <Box marginY={3}>
                <atomic-query-summary></atomic-query-summary>
              </Box>
              <SimpleGrid
                columns={[2, 2, 3, 3]}
                spacingX={4}
                spacingY={{ base: 12, lg: 16 }}
              >
                {isLoadingResultsList || !resultsList.length > 0 ? (
                  new Array(9)
                    .fill(0)
                    .map((value, index) => <ProductTileSkeleton key={index} />)
                ) : (
                  <>
                    {resultsList.map((result) => {
                      return (
                        <React.Fragment key={result.uniqueId}>
                          <ProductCard result={result} />
                        </React.Fragment>
                      );
                    })}
                  </>
                )}
              </SimpleGrid>
              <Flex
                justifyContent={["center", "center", "flex-start"]}
                paddingTop={8}
              >
                <atomic-pager></atomic-pager>
              </Flex>
            </Box>
          </Grid>

        </Box>
      </div>
    </>
  );
};

CoveoSearch.getTemplateName = () => "coveo-search";

export default CoveoSearch;

const myStyles = `


atomic-result-list::part(result-list){
    gap: 1rem 1rem;
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media screen and (max-width: 30em) {
    atomic-result-list::part(result-list){
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

}

atomic-numeric-facet::part(facet) {
    border: none
}


 
atomic-facet::part(facet) {
    border: none
}

#mobile-view-sort atomic-sort-dropdown::part(label){
  display: none
}

#product-card-container{
  padding : 10px;
  transition: all 0.2s ease-in-out;
  border-radius: 6px;
  border: 1px solid transparent;
  position: relative
}

#product-card-container:hover{
-webkit-box-shadow: 0px 0px 9px 3px rgba(0,0,0,0.24); 
box-shadow: 0px 0px 9px 3px rgba(0,0,0,0.24);
border: 1px solid #D3D3D3

}

    `;
