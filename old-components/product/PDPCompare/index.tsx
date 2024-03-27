import ProductSlider from '@old-components/product/ProductSlider'
const PDPCompare = ({ pageConfig, name, products, deviceInfo, activeProduct, attributeNames, maxBasketItemsCount, compareProductsAttributes }: any) => {
  return (
    <div className="px-4 pb-5 mx-auto container-ffx page-container sm:px-4 md:px-6 lg:px-6 2xl:px-0">
      <ProductSlider config={{ newInCollection: products, limit: 20, }} compareProductsAttributes={compareProductsAttributes} products={products} deviceInfo={deviceInfo} activeProduct={activeProduct} attributeNames={attributeNames} maxBasketItemsCount={maxBasketItemsCount} />
    </div>
  )
}

export default PDPCompare
