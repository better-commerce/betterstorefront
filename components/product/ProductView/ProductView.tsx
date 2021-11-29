import { useEffect, useState } from 'react'
import { Tab } from '@headlessui/react'
import { HeartIcon } from '@heroicons/react/outline'
import { StarIcon, PlayIcon } from '@heroicons/react/solid'
import { NextSeo } from 'next-seo'
import classNames from '@components/utils/classNames'
import AttributesHandler from './AttributesHandler'
import { useUI } from '@components/ui/context'
import BreadCrumbs from '@components/ui/BreadCrumbs'
import RelatedProducts from '@components/product/RelatedProducts'
import Bundles from '@components/product/Bundles'
import Reviews from '@components/product/Reviews'
import PriceMatch from '@components/product/PriceMatch'
import Engraving from '@components/product/Engraving'
import ProductDetails from '@components/product/ProductDetails'
import { KEYS_MAP, EVENTS } from '@components/utils/dataLayer'
import cartHandler from '@components/services/cart'
import axios from 'axios'
import {
  NEXT_CREATE_WISHLIST,
  NEXT_BULK_ADD_TO_CART,
  NEXT_UPDATE_CART_INFO,
} from '@components/utils/constants'
import Button from '@components/ui/IndigoButton'

const PLACEMENTS_MAP: any = {
  Head: {
    element: 'head',
    position: 'beforeend',
  },
  PageContainerAfter: {
    element: '.page-container',
    position: 'afterend',
  },
  PageContainerBefore: {
    element: '.page-container',
    position: 'beforebegin',
  },
}

export default function ProductView({
  product = { images: [] },
  snippets,
  setEntities,
  recordEvent,
}: any) {
  const {
    openNotifyUser,
    addToWishlist,
    openWishlist,
    basketId,
    setCartItems,
    user,
    openCart,
  } = useUI()

  const [isPriceMatchModalShown, showPriceMatchModal] = useState(false)
  const [isEngravingOpen, showEngravingModal] = useState(false)
  const [isInWishList, setItemsInWishList] = useState(false)
  const [selectedAttrData, setSelectedAttrData] = useState({
    productId: product.recordId,
    stockCode: product.stockCode,
    ...product,
  })

  useEffect(() => {
    const { entityId, entityName, entityType, entity } = KEYS_MAP
    setEntities({
      [entityId]: product.recordId,
      [entityName]: product.name,
      [entityType]: 'Product',
      [entity]: JSON.stringify(product),
    })
    recordEvent(EVENTS.ProductViewed)
    if (snippets) {
      snippets.forEach((snippet: any) => {
        const domElement = document.querySelector(
          PLACEMENTS_MAP[snippet.placement].element
        )
        if (domElement) {
          domElement.insertAdjacentHTML(
            PLACEMENTS_MAP[snippet.placement].position,
            snippet.content
          )
        }
      })
    }
    //this function is triggered when the component is unmounted. here we clean the injected scripts
    return function cleanup() {
      snippets.forEach((snippet: any) => {
        document
          .getElementsByName(snippet.name)
          .forEach((node: any) => node.remove())
      })
    }
  }, [])

  if (!product) {
    return null
  }

  const handleNotification = () => {
    openNotifyUser(product.recordId)
  }

  let content = [...product.images]

  if (product.videos && product.videos.length > 0) {
    content = [...product.images, ...product.videos]
  }

  const buttonTitle = () => {
    let buttonConfig: any = {
      title: 'Add to bag',
      action: async () => {
        const item = await cartHandler().addToCart({
          basketId: basketId,
          productId: selectedAttrData.productId,
          qty: 1,
          manualUnitPrice: product.price.raw.withTax,
          stockCode: selectedAttrData.stockCode,
        })
        setCartItems(item)
      },
      shortMessage: '',
    }
    if (!selectedAttrData.currentStock && !product.preOrder.isEnabled) {
      if (!product.flags.sellWithoutInventory) {
        buttonConfig.title = 'Notify me'
        buttonConfig.action = () => handleNotification()
        buttonConfig.type = 'button'
      }
    } else if (product.preOrder.isEnabled && !selectedAttrData.currentStock) {
      if (product.preOrder.currentStock < product.preOrder.maxStock) {
        buttonConfig.title = 'Pre-order'
        buttonConfig.shortMessage = product.preOrder.shortMessage
      } else {
        buttonConfig.title = 'Notify me'
        buttonConfig.type = 'button'
        buttonConfig.action = () => handleNotification()
      }
    }
    return buttonConfig
  }

  const buttonConfig = buttonTitle()

  const handleEngravingSubmit = (values: any) => {
    const updatedProduct = {
      ...product,
      ...{
        recordId: selectedAttrData.productId,
        stockCode: selectedAttrData.stockCode,
      },
    }
    const addonProducts = product.relatedProducts.filter(
      (item: any) => item.stockCode === 'ADDON'
    )
    const addonProductsWithParentProduct = addonProducts.map((item: any) => {
      item.parentProductId = product.recordId
      return item
    })
    const computedProducts = [
      ...addonProductsWithParentProduct,
      updatedProduct,
    ].reduce((acc: any, obj: any) => {
      acc.push({
        ProductId: obj.recordId || obj.productId,
        BasketId: basketId,
        ParentProductId: obj.parentProductId || null,
        Qty: 1,
        DisplayOrder: obj.displayOrder || 0,
        StockCode: obj.stockCode,
        ItemType: obj.itemType || 0,
        CustomInfo1: values.line1 || null,

        CustomInfo2: values.line2 || null,

        CustomInfo3: values.line3 || null,

        CustomInfo4: values.line4 || null,

        CustomInfo5: values.line5 || null,

        ProductName: obj.name,

        ManualUnitPrice: obj.manualUnitPrice || 0.0,

        PostCode: obj.postCode || null,

        IsSubscription: obj.subscriptionEnabled || false,

        IsMembership: obj.hasMembership || false,

        SubscriptionPlanId: obj.subscriptionPlanId || null,

        SubscriptionTermId: obj.subscriptionTermId || null,

        UserSubscriptionPricing: obj.userSubscriptionPricing || 0,

        GiftWrapId: obj.giftWrapConfig || null,

        IsGiftWrapApplied: obj.isGiftWrapApplied || false,

        ItemGroupId: obj.itemGroupId || 0,

        PriceMatchReqId:
          obj.priceMatchReqId || '00000000-0000-0000-0000-000000000000',
      })
      return acc
    }, [])

    const asyncHandler = async () => {
      try {
        const newCart = await axios.post(NEXT_BULK_ADD_TO_CART, {
          basketId,
          products: computedProducts,
        })
        await axios.post(NEXT_UPDATE_CART_INFO, {
          basketId,
          info: [...Object.values(values)],
          lineInfo: computedProducts,
        })
        setCartItems(newCart)
        showEngravingModal(false)
      } catch (error) {
        console.log(error, 'err')
      }
    }
    asyncHandler()
  }

  const isEngravingAvailable = !!product.relatedProducts.filter(
    (item: any) => item.stockCode === 'ADDON'
  ).length

  const insertToLocalWishlist = () => {
    addToWishlist(product)
    setItemsInWishList(true)
    openWishlist()
  }
  const handleWishList = () => {
    const accessToken = localStorage.getItem('user')
    if (accessToken) {
      const createWishlist = async () => {
        try {
          await axios.post(NEXT_CREATE_WISHLIST, {
            id: user.userId,
            productId: product.recordId,
            flag: true,
          })
          insertToLocalWishlist()
        } catch (error) {
          console.log(error, 'error')
        }
      }
      createWishlist()
    } else insertToLocalWishlist()
  }

  const filteredRelatedProducts = product.relatedProducts?.filter(
    (item: any) => item.stockCode !== 'ADDON'
  )

  const filteredRelatedProductList = product.relatedProductList?.filter(
    (item: any) => item.stockCode !== 'ADDON'
  )

  return (
    <div className="bg-white page-container">
      {/* Mobile menu */}
      <div className="max-w-7xl mx-auto sm:pt-6 sm:px-6 lg:px-8">
        {product.breadCrumbs && (
          <BreadCrumbs items={product.breadCrumbs} currentProduct={product} />
        )}
      </div>
      <main className="max-w-7xl mx-auto sm:pt-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none">
          {/* Product */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
            {/* Image gallery */}
            <Tab.Group as="div" className="flex flex-col-reverse">
              {/* Image selector */}
              <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                <Tab.List className="grid grid-cols-4 gap-6">
                  {content?.map((image: any, idx) => (
                    <Tab
                      key={`${idx}-tab`}
                      className="relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50"
                    >
                      {() => (
                        <>
                          <span className="sr-only">{image.name}</span>
                          <span className="absolute inset-0 rounded-md overflow-hidden">
                            {image.image ? (
                              <img
                                src={image.image}
                                alt=""
                                className="w-full h-full object-center object-cover"
                              />
                            ) : (
                              <PlayIcon className="h-full w-full object-center object-cover" />
                            )}
                          </span>
                        </>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
              </div>

              <Tab.Panels className="w-full aspect-w-1 aspect-h-1">
                {content?.map((image: any) => (
                  <Tab.Panel key={image.name + 'tab-panel'}>
                    {image.image ? (
                      <img
                        src={image.image}
                        alt={image.name}
                        className="w-full h-full object-center object-cover sm:rounded-lg"
                      />
                    ) : (
                      <iframe
                        width="560"
                        height="315"
                        src={image.url}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>

            {/* Product info */}
            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                {product.name}
              </h1>

              <p className="text-gray-500 text-md">Ref: {product.stockCode}</p>
              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl text-gray-900">
                  {product.price.formatted.withTax}
                  {product.listPrice.raw.tax > 0 ? (
                    <span className="px-5 text-sm line-through text-gray-500">
                      RRP {product.listPrice.formatted.withTax}
                    </span>
                  ) : null}
                </p>
              </div>

              {/* Reviews */}
              <div className="mt-3">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          product.rating > rating
                            ? 'text-indigo-500'
                            : 'text-gray-300',
                          'h-5 w-5 flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="sr-only">{product.rating} out of 5 stars</p>
                </div>
              </div>
              <div className="w-full sm:w-6/12">
                <AttributesHandler
                  product={product}
                  setSelectedAttrData={setSelectedAttrData}
                />
              </div>
              <p
                className="text-gray-900 text-md cursor-pointer hover:underline"
                onClick={() => showPriceMatchModal(true)}
              >
                <span className="font-bold">Seen it cheaper?</span>
                <span>{''} We'll match the best price</span>
              </p>

              <section aria-labelledby="details-heading" className="mt-12">
                <h2 id="details-heading" className="sr-only">
                  Additional details
                </h2>
                <ProductDetails product={product} />

                <div className="mt-10 flex sm:flex-col1">
                  <Button
                    title={buttonConfig.title}
                    action={buttonConfig.action}
                    buttonType={buttonConfig.type || 'cart'}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (!isInWishList) {
                        handleWishList()
                      }
                    }}
                    className="ml-4 py-3 px-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    {isInWishList ? (
                      <span>Item was added in wishlist</span>
                    ) : (
                      <HeartIcon className="h-6 w-6 flex-shrink-0" />
                    )}
                    <span className="sr-only">Add to favorites</span>
                  </button>
                </div>
                {isEngravingAvailable && (
                  <button
                    className="max-w-xs flex-1 mt-5 bg-gray-400 border border-transparent rounded-md py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500 sm:w-full"
                    onClick={() => showEngravingModal(true)}
                  >
                    <span className="font-bold">Engraving</span>
                  </button>
                )}
                <div className="border-t divide-y divide-gray-200 mt-10">
                  <p className="text-gray-900 text-lg">
                    {product.currentStock > 0
                      ? product.deliveryMessage
                      : product.stockAvailabilityMessage}
                  </p>
                </div>
              </section>
            </div>
          </div>

          {product.componentProducts && (
            <Bundles
              price={product.price.formatted.withTax}
              products={product.componentProducts}
            />
          )}
          {filteredRelatedProducts ? (
            <RelatedProducts
              relatedProducts={filteredRelatedProducts}
              relatedProductList={filteredRelatedProductList}
            />
          ) : null}
          <Reviews data={product.reviews} productId={product.recordId} />
          {isEngravingAvailable && (
            <Engraving
              show={isEngravingOpen}
              submitForm={handleEngravingSubmit}
              onClose={() => showEngravingModal(false)}
            />
          )}

          <PriceMatch
            show={isPriceMatchModalShown}
            onClose={showPriceMatchModal}
            productName={product.name}
            productImage={product.images[0]?.image}
            productId={product.id}
            stockCode={product.stockCode}
            ourCost={product.price.raw.withTax}
            rrp={product.listPrice.raw.withTax}
            ourDeliveryCost={product.price.raw.tax} //TBD
          />
        </div>
        <NextSeo
          title={product.name}
          description={product.metaDescription}
          additionalMetaTags={[
            {
              name: 'keywords',
              content: product.metaKeywords,
            },
          ]}
          openGraph={{
            type: 'website',
            title: product.metaTitle,
            description: product.metaDescription,
            images: [
              {
                url: product.image,
                width: 800,
                height: 600,
                alt: product.name,
              },
            ],
          }}
        />
      </main>
    </div>
  )
}
