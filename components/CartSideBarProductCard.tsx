import { generateUri } from '@commerce/utils/uri-util'
import { ChevronDownIcon, EyeIcon, HeartIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import Link from 'next/link'
import { matchStrings } from '@framework/utils/parse-util'
import { useTranslation } from '@commerce/utils/use-translation'
import { CartProductType, DeleteModalType } from '@components/utils/constants'
import wishlistHandler from '@components/services/wishlist'
import BundleProductCard from '@components/BundleProductCard'

export default function CartSideBarProductCard({ openModal, product, handleClose, handleItem, isIncludeVAT, getLineItemSizeWithoutSlug, handleRedirectToPDP, soldOutMessage, handleToggleEngravingModal, setItemClicked, insertToLocalWishlist, reValidateData, handleToggleOpenSizeChangeModal }: any) {
  const translate = useTranslation()
  const { isInWishList } = wishlistHandler()
  const css = { maxWidth: '100%', height: 'auto' }
  return (
    <div className={`grid items-start grid-cols-12 gap-1 py-4 ${product?.price?.raw?.withTax == 0 ? 'bg-green-100 border border-emerald-300 rounded-lg p-2' : 'bg-white border-b border-slate-200 p-2'}`}>
      <div className="flex-shrink-0 col-span-3 overflow-hidden rounded-md">
        <Link href={`/${product?.slug}`}>
          <img width={100} height={100} style={css} src={generateUri(product?.image, 'h=300&fm=webp') || IMG_PLACEHOLDER} alt={product?.name || 'cart-image'} className="object-cover object-center w-full h-full" onClick={handleRedirectToPDP} />
        </Link>
      </div>
      <div className="flex flex-col flex-1 col-span-9 ml-4">
        <div className="flex flex-col flex-1">
          <div className="flex justify-between font-normal text-gray-900 font-sm">
            <h5 onClick={handleClose} className="text-base font-medium dark:text-black">
              <Link href={`/${product?.slug}`}> {product?.name} </Link>
            </h5>
            <p className="mt-0 ml-4 font-semibold text-green">{product?.price?.raw?.withTax > 0 ? isIncludeVAT ? product?.price?.formatted?.withTax : product?.price?.formatted?.withoutTax : <span className="font-medium uppercase text-14 xs-text-14 text-emerald-600">FREE</span>}</p>
          </div>
          <div className="flex flex-col">
            <div className="mt-1.5 sm:mt-1.5 flex text-sm text-slate-600 dark:text-slate-300 justify-between gap-2 items-center">
              <span className="flex">
                {product?.colorName != '' && (
                  <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4 dark:text-slate-600" viewBox="0 0 24 24" fill="none">
                      <path d="M7.01 18.0001L3 13.9901C1.66 12.6501 1.66 11.32 3 9.98004L9.68 3.30005L17.03 10.6501C17.4 11.0201 17.4 11.6201 17.03 11.9901L11.01 18.0101C9.69 19.3301 8.35 19.3301 7.01 18.0001Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8.35 1.94995L9.69 3.28992" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2.07 11.92L17.19 11.26" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3 22H16" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M18.85 15C18.85 15 17 17.01 17 18.24C17 19.26 17.83 20.09 18.85 20.09C19.87 20.09 20.7 19.26 20.7 18.24C20.7 17.01 18.85 15 18.85 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="dark:text-slate-600">{product?.colorName}</span>
                  </div>
                )}
                {product?.size != '' && product?.size != 'n/a' && (
                  <>
                    <span className="mx-2 border-l border-slate-200 dark:border-slate-700 "></span>
                    <div className="flex items-center space-x-1.5">
                      <svg className="w-4 h-4 dark:text-slate-600" viewBox="0 0 24 24" fill="none">
                        <path d="M21 9V3H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 15V21H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M21 3L13.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10.5 13.5L3 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="uppercase dark:text-slate-600">{product?.size}</span>
                    </div>
                  </>
                )}
              </span>
              {product?.price?.raw?.withTax > 0 && (
                <div className="flex flex-row items-center justify-end px-4 text-gray-900 border">
                  {!product?.isMembership && <MinusIcon onClick={() => handleItem(product, 'decrease')} className="w-4 cursor-pointer" />}
                  <span className="px-2 py-2 text-md"> {product?.qty} </span>
                  {!product?.isMembership && <PlusIcon className="w-4 cursor-pointer" onClick={() => handleItem(product, 'increase')} />}
                </div>
              )}
            </div>
          </div>
          <div className="">
            {product?.children
              ?.filter((x: any) => x?.itemType === CartProductType.ENGRAVING)
              ?.map((child: any, index: number) => (
                <div key={index} className="flex">
                  <div className="flex flex-col mt-2 mb-6">
                    <div className="flex justify-between font-medium text-gray-900">
                      <div className="image-container">
                        <span
                          className="align-middle cursor-pointer"
                          onClick={() => {
                            handleToggleEngravingModal(product)
                          }}
                          title={translate('common.label.viewPersonalisationText')}
                        >
                          <EyeIcon className="inline-block w-4 h-4 hover:text-gray-400 lg:-mt-2 md:-mt-1 xsm:-mt-3 xsm:h-5" />
                        </span>
                      </div>
                      <p className="ml-1 mr-1 font-thin text-gray-500"> | </p>
                      <h3 className="flex justify-between m-auto">
                        <span className="text-xs uppercase cursor-default">{translate('common.label.personalisationText')}</span>
                        <span className="mt-0 ml-4 text-xs text-green"> {isIncludeVAT ? child?.price?.formatted?.withTax : child?.price?.formatted?.withoutTax} </span>
                      </h3>
                    </div>
                    <button
                      type="button"
                      className="-ml-32 text-xs font-medium text-indigo-600 hover:text-indigo-500"
                      onClick={() => {
                        openModal()
                        setItemClicked({ type: DeleteModalType.ENGRAVING, product: child })
                      }}
                    >
                      {translate('common.label.removeText')}
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex items-end justify-between text-sm">
            <div className="flex justify-between w-full">
              {product?.variantProducts?.length > 0 ? (
                <div role="button" onClick={handleToggleOpenSizeChangeModal.bind(null, product)} className="w-full mt-2">
                  <div className="border w-[fit-content] flex flex-row justify-between items-center py-2 px-2">
                    <p className="m-auto mr-1 text-sm text-gray-700">
                      Size: <span className="uppercase"> {getLineItemSizeWithoutSlug(product)} </span>
                    </p>
                    <ChevronDownIcon className="w-4 h-4 text-black" />
                  </div>
                </div>
              ) : (
                <div className="w-full"></div>
              )}

              <div className="flex justify-between pl-0 pr-0 mt-2 sm:mt-2 sm:pr-0">
                {reValidateData?.message != null &&
                  soldOutMessage != '' &&
                  (matchStrings(soldOutMessage, 'sold out', true) ? (
                    <div className="flex flex-col col-span-12">
                      <div className="flex text-xs font-semibold text-left text-red-500">
                        <span className="relative mr-1">
                          <img alt="Sold Out" src="/assets/images/not-shipped-edd.svg" width={20} height={20} className="relative inline-block mr-1 top-2" />
                        </span>
                        <span className="mt-2">{soldOutMessage}</span>
                      </div>
                    </div>
                  ) : (
                    matchStrings(soldOutMessage, 'price changed', true) && (
                      <div className="items-center w-full col-span-12">
                        <div className="flex justify-center w-full p-1 text-xs font-semibold text-center text-gray-500 bg-gray-100 border border-gray-100 rounded">{soldOutMessage}</div>
                      </div>
                    )
                  ))}
              </div>
            </div>
          </div>
          {product?.price?.raw?.withTax > 0 && (
            <div className="flex flex-row justify-between mt-0 \text-left">
              <button
                className="flex items-center gap-1 text-xs font-medium text-left text-gray-700 hover:text-black"
                onClick={() => {
                  insertToLocalWishlist(product)
                }}
                disabled={isInWishList(product?.productId)}
              >
                {isInWishList(product?.productId) ? (
                  <>
                    <HeartIcon className="w-4 h-4 text-sm text-red-500 hover:text-red-700" /> {translate('label.product?.wishlistedText')}
                  </>
                ) : (
                  <>
                    {' '}
                    <HeartIcon className="w-4 h-4 text-sm text-gray-500 dark:text-slate-500" /> {translate('label.wishlist.moveToWishlistText')}{' '}
                  </>
                )}
              </button>
              <button
                type="button"
                className="flex items-center gap-1 text-xs font-normal text-left text-red-400 group "
                onClick={() => {
                  openModal()
                  setItemClicked({ type: DeleteModalType.PRODUCT, product: product })
                }}
              >
                <span className="relative z-10 flex items-center mt-0 text-sm font-medium text-primary-6000 hover:text-primary-500 ">{translate('common.label.removeText')}</span>
              </button>
            </div>
          )}
          {product?.children
            ?.filter((item: any) => item?.itemType !== CartProductType.ENGRAVING)
            ?.map((child: any, index: number) => (
              <BundleProductCard key={index} product={child} andleRedirectToPDP={handleRedirectToPDP} handleClose={handleClose} />
            ))}
        </div>
      </div>
    </div>
  )
}
