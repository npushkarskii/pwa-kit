import React from "react";
import PropTypes from "prop-types";

import { loadFieldActions, loadQueryActions, loadSearchActions, loadSearchAnalyticsActions } from "@coveo/atomic/headless";
import { AtomicSearchBox, AtomicResultList } from "@coveo/atomic-react";


import { Box, Grid, Stack, useMultiStyleConfig, AspectRatio, Text, Link } from "@chakra-ui/react";
import DynamicImage from "../../components/dynamic-image";

import { useIntl } from "react-intl";
import { productUrlBuilder } from "../../utils/url";


const CoveoSearch = (props) => {
  const intl = useIntl();
  const {
    searchQuery
  } = props;
  const styles = useMultiStyleConfig("ProductTile");
  const dynamicImageProps = {
    widths: ["50vw", "50vw", "20vw", "20vw", "25vw"],
  };

  return (
    <div>
      <atomic-search-interface>

        <Grid templateColumns={{ base: "1fr", md: "280px 1fr" }} columnGap={6}>
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
              <atomic-facet field='year' label='Year'></atomic-facet>
            </atomic-facet-manager>
          </Stack>
          <Box>
            <AtomicResultList
              display='grid'
              template={(r) => (
                <>
                  <Link data-testid='product-tile' {...styles.container} href={productUrlBuilder({ id: r.raw.ec_productid }, intl.local)}>
                  <Box {...styles.imageWrapper}>
                    <AspectRatio {...styles.image}>
                      <DynamicImage
                        src={`${r.raw.ec_images[0]}[?sw={width}&q=60]`}
                        widths={dynamicImageProps?.widths}
                        imageProps={{
                          alt: "image.alt",
                          ...dynamicImageProps?.imageProps,
                        }}
                      />
                    </AspectRatio>
                  </Box>

                  {/* Title */}
                    <Text {...styles.title}>{r.raw.ec_name}</Text>

                  {/* Price */}
                  <Text {...styles.price}>
                    {
                      r.raw.ec_price
                    }
                  </Text>
                  </Link>
                </>
              )}
            />
          </Box>
        </Grid>
      </atomic-search-interface>
    </div>
  );
};

CoveoSearch.getTemplateName = () => "coveo-search";

CoveoSearch.shouldGetProps = ({ previousLocation, location }) => !previousLocation || previousLocation.pathname !== location.pathname || previousLocation.search !== location.search;

CoveoSearch.getProps = async ({ engine, location }) => {
  const searchInterface = document.querySelector("atomic-search-interface");

  const urlParams = new URLSearchParams(location.search);
  let searchQuery = urlParams.get("q");
  const newProps = { searchQuery };

  if (!engine) {
    // engine = buildSearchEngine({
    //     configuration: getSampleSearchEngineConfiguration()
    // })
    const configuration = {
      accessToken: "xx048a95cc-60a2-4bc0-ade1-fd2b24dc8870",
      organizationId: "barcagroupproductionkwvdy6lp",
      search : {
        pipeline : 'Sports'
      }
    };
    await searchInterface.initialize(configuration);

    newProps.engine = engine = searchInterface.engine;

    const fieldActions = loadFieldActions(engine);
    engine.dispatch(fieldActions.registerFieldsToInclude("ec_name,ec_price,ec_images,ec_productid,sf_c_currency,sf_c_image,sf_c_price,title,uri".split(",")));
  }

  // execute search
  const searchActions = loadSearchActions(engine);
  const queryActions = loadQueryActions(engine);
  const analyticsActions = loadSearchAnalyticsActions(engine);
  await engine.dispatch(queryActions.updateQuery({ q: searchQuery || "test" }));
  const searchResults = await engine.dispatch(searchActions.executeSearch(analyticsActions.logSearchboxSubmit()));

  newProps.searchResults = searchResults;

  return newProps;
};

CoveoSearch.propTypes = {
  engine: PropTypes.object,
  isLoading: PropTypes.bool,

  location: PropTypes.object,
  searchQuery: PropTypes.string,
};

export default CoveoSearch;