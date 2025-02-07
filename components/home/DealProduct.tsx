import dynamic from 'next/dynamic'
import { useMemo } from 'react'

import { IDeviceInfo } from '@components/ui/context'
const FeatureProductCard = dynamic(() => import('@components/Product/ProductCard/FeaturedProductCard'))

interface IDealProductProps {
  readonly data: any
  readonly config: any
  readonly deviceInfo: IDeviceInfo
  readonly maxBasketItemsCount?: any
  readonly dealOfTheWeekProductPromoDetails: any
}

const DealProduct: React.FC<IDealProductProps> = ({ data, config, deviceInfo, maxBasketItemsCount, dealOfTheWeekProductPromoDetails }: IDealProductProps) => {
  const featureProduct = useMemo(() => data?.featureproduct?.[0], [data?.featureproduct])

  if (!featureProduct) return <></>

  return (
    <div>
      <FeatureProductCard product={featureProduct} hideWishlistCTA={true} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} productPromoDetails={dealOfTheWeekProductPromoDetails} config={config} />
    </div>
  )
}
export default DealProduct
