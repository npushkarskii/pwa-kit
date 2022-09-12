import React from 'react'
import {AspectRatio, Badge, Box, Checkbox, Stack,  Text,  useMultiStyleConfig,} from '@chakra-ui/react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import DynamicImage from '../../components/dynamic-image'
import { useIntl } from 'react-intl'
import { productUrlBuilder } from '../../utils/url'


const ProductCard = ({result}) => {

    const intl = useIntl();
    const dynamicImageProps = {
        widths: ["50vw", "50vw", "20vw", "20vw", "25vw"],
      };
    const styles = useMultiStyleConfig("ProductTile");
      console.log(result)
    return (
        <Link
          data-testid="product-tile"
          {...styles.container}
          to = {productUrlBuilder({ id: result.raw.ec_productid }, intl.local)}
          id={'product-card-container'}
        >
            <Box position={'absolute'} zIndex={'10'} right={'10px'} top={'15px'} margin={'5px'}> 
            {result.isTopResult && <Badge variant='solid' colorScheme='green' margin={'5px'}>Featured</Badge>}   
            {result.isRecommendation && <Badge variant='solid' colorScheme='blue' margin={'5px'}>Recommended</Badge>}
            </Box>

          <Box {...styles.imageWrapper}>
            <AspectRatio {...styles.image}>
              <DynamicImage
                src={
                  result.raw.ec_images !== undefined
                    ? `${result.raw?.ec_images[0]}[?sw={width}&q=60]`
                    : "https://www.grouphealth.ca/wp-content/uploads/2018/05/placeholder-image.png"
                }
                widths={dynamicImageProps?.widths}
                imageProps={{
                  alt: "image.alt",
                  ...dynamicImageProps?.imageProps,
                }}
              />
            </AspectRatio>
          </Box>

          <Text {...styles.title}>{result.raw.ec_name}</Text>
          <Text {...styles.price}>${result.raw.ec_price}</Text>
        </Link>
    )
}

export default ProductCard
