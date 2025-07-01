import dynamic from 'next/dynamic';
const ProductCard = dynamic(() => import('@components/ProductCard'))
const TabComponent = ({ products, productPerColumn, deviceInfo, maxBasketItemsCount, defaultDisplayMembership, featureToggle }: any) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 r-display-none">
      {products?.map((product: any, pId: number) => (
        <div key={`product-${pId}`} className="flex flex-col w-full">
          <ProductCard data={product} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
        </div>
      ))}
    </div>
  );
};

export default TabComponent;