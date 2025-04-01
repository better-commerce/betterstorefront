import dynamic from 'next/dynamic';
import React, { useState } from 'react';
const ProductCard = dynamic(() => import('@components/ProductCard'))

const TabComponent = ({ products, productPerColumn, deviceInfo, maxBasketItemsCount, defaultDisplayMembership, featureToggle }: any) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 r-display-none">
      {products?.map((product: any, pId: number) => (
        <ProductCard data={product} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership}/>
      ))}
    </div>
  );
};

export default TabComponent;