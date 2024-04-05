import { useState, Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { RadioGroup } from '@headlessui/react'
import cn from 'classnames'
import * as yup from 'yup'
import axios from 'axios'
import { Button, LoadingDots, useUI } from '@components/ui'
import { NEXT_BULK_ADD_TO_CART, NEXT_GET_PRODUCT, PRODUCTS_SLUG_PREFIX, } from '@components/utils/constants'
import { matchStrings } from '@framework/utils/parse-util'
import { Guid } from '@commerce/types'
import { useTranslation } from '@commerce/utils/use-translation'

const SIZE_ATTRIBUTE = 'clothing.size'

function SizeChangeModal({ open, handleToggleOpen, product }: any) {
  const translate = useTranslation()
  const { setCartItems, cartItems, basketId } = useUI()
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState('')

  const [productSizeData, setProductSizeData] = useState<any>(null)
  const [productStockCodesWithSize, setProductStockCodesWithSize] =
    useState<any>(null)
  const [isSizeUpdateLoading, setIsSizeUpdateLoading] = useState(false)
  const [defaultSize, setDefaultSize] = useState<any>(null)

  useEffect(() => {
    let arrStockCode: any = product?.stockCode?.split('-')
    let sizeFromStockCode = arrStockCode?.length
      ? arrStockCode[arrStockCode?.length - 1]
      : ''
    setDefaultSize(sizeFromStockCode.toLowerCase())
  }, [open])

  useEffect(() => {
    // update current size of the product
    if (!productStockCodesWithSize) return
    const stockCodeValues: any = Object.values(productStockCodesWithSize)
    setValue(
      stockCodeValues?.find((o: any) => product?.stockCode === o?.stockCode)
        ?.sizeValue || ''
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productStockCodesWithSize])

  useEffect(() => {
    setTimeout(() => setIsOpen(open), 500)

    if (open) {
      // fetch product data when modal is open
      fetchProductBySlug(product)
    }

    // on unmount
    return () => {
      // reset data
      setProductSizeData(null)
      setValue('')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const fetchProductBySlug = async (product: any) => {
    try {
      const productSlug = product?.slug?.replace(PRODUCTS_SLUG_PREFIX, '')

      // fetch updated product details
      const productRes: any = await axios.post(NEXT_GET_PRODUCT, {
        slug: productSlug,
      })
      const productDetailsObj = productRes?.data?.product

      for (let i = 0; i < productDetailsObj?.variantProducts?.length; i++) {
        const variantItemObj = productDetailsObj?.variantProducts[i]

        // if required keys does not exist then skip the current iteration
        if (
          !variantItemObj?.stockCode ||
          !variantItemObj?.attributes ||
          variantItemObj?.attributes?.length < 1
        ) {
          return
        }

        const sizeObj = variantItemObj?.attributes?.find(
          (o: any) => o.fieldCode === SIZE_ATTRIBUTE
        )

        setProductStockCodesWithSize((v: any) => ({
          ...v,
          [sizeObj?.fieldValue]: {
            sizeValue: sizeObj?.fieldValue,
            stockCode: variantItemObj?.stockCode,
            productId: variantItemObj?.productId,
          },
        }))
      }

      // find product size values
      let fieldValues : any[] = productDetailsObj?.variantAttributes?.find(
        (o: any) => o.fieldCode === SIZE_ATTRIBUTE
      ).fieldValues

      let productSizesArrObj: any[] = productDetailsObj?.variantProducts
        ?.filter((item: any) => item?.attributes?.find((attr: any) => attr.fieldCode === SIZE_ATTRIBUTE))
        ?.map((o: any) => {
          const field = o?.attributes?.find((attr: any) => attr.fieldCode === SIZE_ATTRIBUTE);
          const fieldValueData = fieldValues.find( (value: any) => value.fieldValue === field?.fieldValue)
          return {
            currentStock: o?.currentStock,
            stockCode: o?.stockCode,
            sellWithoutInventory: o?.sellWithoutInventory,
            slug: o?.slug,
            ...fieldValueData,
          };
        });

      if (productSizesArrObj?.length > 0) {
        // sort product sizes
        productSizesArrObj = productSizesArrObj?.sort(
          (a: any, b: any) => a.displayOrder - b.displayOrder
        )
        setProductSizeData(productSizesArrObj)
      }
    } catch (error) {
      // console.log(error)
    }
  }

  const handleUpdateProductItemSize = async (
    selectedProduct: any,
    newStockCode: string,
    newItemId: string
  ) => {
    // start loader
    setIsSizeUpdateLoading(true)

    try {
      const oldLineItem = cartItems?.lineItems?.find((x: any) =>
        matchStrings(x?.productId, selectedProduct?.productId, true)
      )

      if (oldLineItem) {
        const itemToBeDeleted = {
          productId: selectedProduct?.productId, // old product id for old size item
          stockCode: selectedProduct?.stockCode, // old stock code
          parentProductId: Guid.empty,
          qty: 0,
        }

        const itemToBeSaved = {
          productId: newItemId, // new product id for new size item
          parentProductId: Guid.empty,
          stockCode: newStockCode, // new stock code
          qty: oldLineItem?.qty,
          displayOrder: oldLineItem?.displayOrder,
          customInfo1: oldLineItem?.customInfo1,
          customInfo2: oldLineItem?.customInfo2,
          customInfo3: oldLineItem?.customInfo3,
          customInfo4: oldLineItem?.customInfo4,
          customInfo5: oldLineItem?.customInfo5,
          customInfo1Formatted: oldLineItem?.customInfo1Formatted,
          customInfo2Formatted: oldLineItem?.customInfo2Formatted,
          customInfo3Formatted: oldLineItem?.customInfo3Formatted,
          customInfo4Formatted: oldLineItem?.customInfo4Formatted,
          customInfo5Formatted: oldLineItem?.customInfo5Formatted,
        }

        let products = [...[itemToBeDeleted], ...[itemToBeSaved]]

        if (oldLineItem?.children?.length > 0) {
          const childItemObj = oldLineItem?.children[0]
          const personalizedItemToBeSaved = {
            productId: childItemObj?.productId, // new personalize item product id
            parentProductId: newItemId, // new product id
            stockCode: childItemObj?.stockCode,
            qty: childItemObj?.qty,
            displayOrder: childItemObj?.displayOrder,
            customInfo1: childItemObj?.customInfo1,
            customInfo2: childItemObj?.customInfo2,
            customInfo3: childItemObj?.customInfo3,
            customInfo4: childItemObj?.customInfo4,
            customInfo5: childItemObj?.customInfo5,
            customInfo1Formatted: childItemObj?.customInfo1Formatted,
            customInfo2Formatted: childItemObj?.customInfo2Formatted,
            customInfo3Formatted: childItemObj?.customInfo3Formatted,
            customInfo4Formatted: childItemObj?.customInfo4Formatted,
            customInfo5Formatted: childItemObj?.customInfo5Formatted,
          }

          products = [...products, ...[personalizedItemToBeSaved]]
        }

        const { data: newCart }: any = await axios.post(NEXT_BULK_ADD_TO_CART, { data: { basketId, products } })

        if (newCart?.id && newCart?.id != Guid.empty) {
          setCartItems(newCart)
          // setAlert({
          //   type: 'success',
          //   msg: 'Product size updated successfully',
          // })
        }

        setProductSizeData(null)
        handleToggleOpen()
        setIsSizeUpdateLoading(false)
      } else {
        throw new Error('Something went wrong.')
      }
    } catch (error) {
      // setAlert({
      //   type: 'error',
      //   msg: 'Something went wrong.',
      // })
    }
  }

  const handleSubmit = async () => {
    const schema = yup.string().required()
    const validatedVal = await schema.validate(value)

    if (!validatedVal) return false

    const newItemId =
      productStockCodesWithSize &&
      productStockCodesWithSize[validatedVal]?.productId
    const newItemStockCode =
      productStockCodesWithSize &&
      productStockCodesWithSize[validatedVal]?.stockCode

    // bulk update basket handler
    handleUpdateProductItemSize(product, newItemStockCode, newItemId)
    return validatedVal
  }

  const handleCloseModal = () => {
    setIsOpen(false)
    setTimeout(() => {
      handleToggleOpen()
    }, 500)
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        onClose={handleCloseModal}
        className="fixed inset-0 overflow-hidden z-[99999]"
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* The backdrop */}
          <div className="fixed inset-0 bg-gray-900/30" aria-hidden="true" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="transition-transform duration-500 ease-out"
          enterFrom="transform translate-y-full"
          enterTo="transform translate-y-0"
          leave="transition-transform duration-300 ease-in"
          leaveFrom="transform translate-y-0"
          leaveTo="transform translate-y-full"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-lg mx-auto bg-white">
              <Dialog.Title className="p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold font-20">{translate('label.filters.changeSizeText')}</p>
                  <span className="p-2 -mr-2 cursor-pointer hover:bg-gray-100" role="button" tabIndex={0} onClick={handleCloseModal} onKeyDown={handleCloseModal} >
                    <XMarkIcon className="w-4 h-4" />
                  </span>
                </div>
              </Dialog.Title>

              <hr />

              <div className="p-3">
                <RadioGroup value={value} onChange={setValue}>
                  {/* <RadioGroup.Label>
                    <span className="font-semibold">Size:</span> {value}
                  </RadioGroup.Label> */}
                  <div className="grid grid-cols-5 gap-2 mt-2 mb-6 sm:grid-cols-7">
                    {productSizeData?.length > 0 ? (productSizeData?.map((size: any) => (
                      <RadioGroup.Option key={size?.fieldValue} value={size?.fieldValue} as={Fragment} disabled={size?.fieldValue === value} >
                        {({ checked, disabled }) => (
                          <li
                            className={cn(
                              'outline relative outline-gray-300 outline-1 ml-[1px] list-none text-center cursor-pointer px-3 py-2 flex-1 hover:bg-sky-700 transition-colors uppercase duration-75 rounded-xl',
                              {
                                'bg-sky-500 text-white outline-sky-500 z-50 cursor-pointer': checked,
                                '!cursor-default': disabled,
                                '!bg-slate-100 !cursor-not-allowed !pointer-events-none !text-slate-400': !(size?.currentStock || size?.sellWithoutInventory)
                              }
                            )}
                          >
                            {!(size?.currentStock || size?.sellWithoutInventory) && <div className="w-[1px] h-[55px] bg-[#0000004d] absolute -top-[8px] left-1/2 rotate-45" />}
                            {size?.fieldValue}
                          </li>
                        )}
                      </RadioGroup.Option>
                    ))
                    ) : (
                      <LoadingDots />
                    )}
                  </div>
                </RadioGroup>

              </div>
              <div className='flex flex-col items-center justify-end p-2 border-t border-slate-200'>
                <Button type="button" className={`!py-3 text-sm font-bold w-full text-center text-white bg-red-700 border cursor-pointer ${false ? 'opacity-80 !cursor-not-allowed' : ''}`} disabled={!Boolean(value) || isSizeUpdateLoading || value === defaultSize} onClick={handleSubmit} >
                  {isSizeUpdateLoading ? 'Updating...' : value ? translate('label.product.updateSizeText') : translate('label.product.sizeSelectiontext')}
                </Button>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

export default SizeChangeModal
