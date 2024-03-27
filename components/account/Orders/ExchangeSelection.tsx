// Base Imports
import { Fragment, useEffect, useState } from 'react'

// Package Imports
import axios from 'axios'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

// Component Imports
import { LoadingDots } from '@components//ui'
import AttributesHandler from '@components//Product/AttributesHandler'

// Other Imports
import { matchStrings } from '@framework/utils/parse-util'
import {
  /*CancelOrderPageAction,*/ NEXT_GET_PRODUCT,
  PRODUCTS_SLUG_PREFIX,
} from '@components//utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'
// import Spinner from '@components//ui/Spinner';
// import SubmitButton from '@old-components/common/SubmitButton';

const ExchangeSelection = ({
  btnTitle,
  item,
  reason,
  selectedImages,
  onGetProduct,
  onItemExchange,
  submitState,
  deviceInfo,
}: any) => {
  const translate = useTranslation()
  const SIZE_ATTRIBUTE = 'clothing.size'
  const COLOR_ATTRIBUTE = 'global.colour'
  const [isOpen, setIsOpen] = useState(false)
  const [product, setProduct] = useState<any>(undefined)
  const [selectedGroupName, setSelectedGroupName] = useState<any>(undefined)
  const [selectedValue, setSelectedValue] = useState<any>()

  const [selectedAttrData, setSelectedAttrData] = useState({
    productId: product?.recordId,
    stockCode: product?.stockCode,
    ...product,
  })

  useEffect(() => {
    const handleAsync = async (slug: string) => {
      const product = await onGetProduct(slug)
      setProduct(product?.product)
    }

    if (item?.slug) {
      handleAsync(item?.slug)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item])

  const openModal = () => {
    setIsOpen(true)
  }
  const closeModal = () => {
    setIsOpen(false)
  }

  const getStockForSize = (variant: string) => {
    let productData = {
      stock: 0,
      productId: '',
      isPreOrderEnabled: false,
      sellWithoutInventory: false,
      stockCode: '',
    }
    // const slug = `${PRODUCTS_ROUTE_PREFIX}${router.query.slug}`
    product.variantProducts.find((product: any) => {
      product.attributes.forEach((attr: any) => {
        if (
          SIZE_ATTRIBUTE.toLowerCase() === attr.fieldCode.toLowerCase() &&
          attr.fieldValue === variant
          // product.slug === slug
        ) {
          productData.stock = product.currentStock
          productData = { ...productData, ...product }
        }
      })
    })
    // console.log("STOCK_DATA",productData)
    return productData
  }

  const setValue = (key: string, value: string) => {
    if (!selectedValue) {
      setSelectedValue({ [key]: value })
    } else {
      const newValue = { ...selectedValue, ...{ [key]: value } }
      setSelectedValue(newValue)
    }
  }

  const attributeChanged = (
    fieldCode: string,
    value: string,
    colorItem: any
  ) => {
    //console.log("fieldCode", fieldCode);
    //console.log("value", value);

    //product?.variantProducts?.find((item: any) => {
    const selectedOption = product.customAttributes.find((option: any) => {
      const isFieldCode = option.key === fieldCode
      const isFieldValue = option.value === value
      return isFieldCode && isFieldValue
    })
    //});

    setValue(fieldCode, value)
    if (matchStrings(fieldCode, SIZE_ATTRIBUTE, true)) {
      const productCode = product?.stockCode?.substring(
        0,
        product?.stockCode?.lastIndexOf('-')
      )
      const newStockCode = `${productCode}-${value}`
      const newProduct = product?.variantProducts?.find((x: any) =>
        matchStrings(x?.stockCode, newStockCode, true)
      )
      if (newProduct?.productId) {
        const updatedProduct = {
          ...product,
          ...{
            // stock:'',
            productId: newProduct?.productId,
            stockCode: newStockCode,
            currentStock: getStockForSize(value).stock,
          },
        }
        // console.log('UPDATED VS STOCK------UPDATED',updatedProduct)
        // console.log('UPDATED VS STOCK------STOCK',getStockForSize(value))
        //console.log("findProductMatch", updatedProduct);
        setSelectedAttrData(updatedProduct)
        setProduct(updatedProduct)
      }
    } else {
      if (colorItem?.slug) {
        //console.log(colorItem)
        let slug = colorItem?.slug
        const handleAsync = async (slug: string) => {
          const { data: difColoredProd }: any = await axios.post(
            NEXT_GET_PRODUCT,
            { slug: slug }
          )
          //console.log("difColoredProd?.product?.variantProducts", difColoredProd?.product?.variantProducts);

          let selectedSize = product?.customAttributes?.filter(
            (attr: any) => attr.key === SIZE_ATTRIBUTE
          )[0]?.value
          if (selectedValue && selectedValue[SIZE_ATTRIBUTE]) {
            selectedSize = selectedValue[SIZE_ATTRIBUTE]
          }

          //console.log("selectedSize", selectedSize);
          const findProductMatch =
            difColoredProd?.product?.variantProducts?.find((x: any) =>
              matchStrings(
                x?.attributes?.find((attr: any) =>
                  matchStrings(attr?.fieldCode, SIZE_ATTRIBUTE, true)
                )?.fieldValue,
                selectedSize,
                true
              )
            )
          //console.log("findProductMatch", findProductMatch);

          if (findProductMatch) {
            const updatedProduct = {
              ...difColoredProd?.product,
              ...{
                productId: findProductMatch?.productId,
                stockCode: findProductMatch.stockCode,
                currentStock: findProductMatch.currentStock,
              },
            }
            setSelectedAttrData(updatedProduct)
            setProduct(updatedProduct)
          } else {
            setSelectedAttrData(undefined)
            setProduct(undefined)
          }
        }

        slug = slug.replace(PRODUCTS_SLUG_PREFIX, '')
        const newSlug = slug?.startsWith('/') ? slug?.substring(1) : slug
        handleAsync(newSlug)
      }
    }
  }

  const handleChange = (key: string, value: any, values?: Array<any>) => {
    if (values?.length) {
      let obj: any = {}
      obj[key] = values?.find((x: any) =>
        matchStrings(x?.fieldValue, value, true)
      )?.fieldLabel
      setSelectedGroupName({
        //...selectedGroupName || {},
        ...{ ...obj },
      })
    }
  }

  return (
    <>
      {/* Exchange section start */}
      <div className="w-full cancel-section">
        <div className="mx-auto cancel-continer">
          {!product ? (
            // <Spinner />
            <div />
          ) : (
            <>
              <h4 className="mb-4 text-xl font-semibold text-black">
                {translate('label.exchangeSelection.exchangeVariantHeadingText')} </h4>
              <p className="text-base text-primary">
                {translate('label.exchangeSelection.exchangeVariantText')} </p>

              <div className="w-full mt-4">
                <AttributesHandler
                  product={product}
                  variant={selectedAttrData}
                  setSelectedAttrData={setSelectedAttrData}
                  onChange={attributeChanged}
                  allowCart={false}
                  forInputSelection={true}
                  selectedValue={selectedValue}
                  currentPage="Exchange & Return"
                  deviceInfo={deviceInfo}
                />

                <div className="w-full">
                  <div className="py-4">
                    <button
                      type="button"
                      className={`block w-full px-8 text-center text-white bg-black border btn-basic-property hover:bg-gray-800 ${
                        !product?.productId
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                      onClick={openModal}
                      disabled={!product?.productId ? true : false}
                    >
                      {btnTitle || 'Request for Exchange'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Exchange section start */}

      {/* modal return order */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          open={isOpen}
          className="relative z-10"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-100 sm:duration-100"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transform transition ease-in-out duration-100 sm:duration-100"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <div className="fixed inset-0 bg-orange-900/20" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md p-0 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl">
                  <div className="relative z-50 flex flex-col h-full">
                    <div className="w-full sm:z-10 sm:left-1 sm:top-1">
                      <div className="flex justify-between px-4 py-3 border-b">
                        <div>
                          <h3 className="text-base font-semibold text-black dark:text-black">
                            {translate('label.exchangeSelection.exchangeItemText')} {' '}
                          </h3>
                        </div>
                        <button
                          type="button"
                          className="text-black rounded-md outline-none hover:text-gray-500"
                          onClick={closeModal}
                        >
                          <span className="sr-only">{translate('common.label.closePanelText')}</span>
                          <XMarkIcon
                            className="relative top-0 w-7 h-7"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                      <div className="w-full p-6 overflow-y-auto">
                        <div className="w-full">
                          <p className="text-sm text-black">
                            {translate('label.exchangeSelection.exchangeConfirmText')}?{' '}
                            {/*You'll miss out on savings of 648!*/}
                          </p>
                        </div>
                        <div className="w-full"></div>

                        <div className="w-full py-4">
                          {/* <SubmitButton
                                                        cssClass="w-full min-height-btn-r flex items-center justify-center px-4 py-3 -mr-0.5 text-red-700 bg-white border-2 border-red-500 rounded-sm hover:bg-gray-100 hover:text-red-800 sm:px-6 hover:border-red-800"
                                                        submitState={submitState}
                                                        // source={CancelOrderPageAction.CANCEL}
                                                        onClick={async () => {
                                                            await onItemExchange(reason, selectedImages, product)
                                                        }}
                                                    >
                                                        Exchange Item
                                                    </SubmitButton> */}
                          <a
                            href="javascript:void(0)"
                            className="block w-full px-4 py-3 font-bold text-center text-black border rounde-sm"
                            onClick={() => closeModal()}
                          >
                            {translate('label.exchangeSelection.dontExchangeText')} </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* modal return order */}
    </>
  )
}

export default ExchangeSelection
