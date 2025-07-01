import dynamic from 'next/dynamic';
const ProductUsedCard = dynamic(() => import('@components/ProductUsedCard'))
const TabComponent = ({ products, productPerColumn, deviceInfo, maxBasketItemsCount, defaultDisplayMembership, featureToggle }: any) => {
  return (
    <div className="flex w-full r-display-none">
        <div className="flex flex-col w-full">
          <ProductUsedCard data={products} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
        </div>
    </div>
  );
};

export default TabComponent;