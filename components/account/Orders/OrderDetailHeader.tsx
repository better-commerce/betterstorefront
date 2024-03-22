import { DATE_FORMAT } from '@components/utils/constants'
import { priceFormat } from '@framework/utils/parse-util'
import moment from 'moment'
import React from 'react'
import { useTranslation } from '@commerce/utils/use-translation'
import { useRouter } from 'next/router'
const OrderDetailHeader = ({ details, showDetailedOrder }: any) => {
  const translate = useTranslation();
  const router = useRouter();
  return (
    <>
      <div className="w-full pb-6 o-detail-header">
        <div className="w-full">
          <div className="flex justify-between">
            <div className="relative pl-9">
              <a
                href="#"
                className="absolute left-0 top-2/4 -translate-y-2/4 "
                onClick={() => {
                  router.push('/my-account/orders')
                  // showDetailedOrder(false)
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-arrow-left"
                  viewBox="0 0 16 16"
                >
                  {' '}
                  <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />{' '}
                </svg>
              </a>
              {
                //let orderLabel.order=  Details";
              }

              <div className="w-full">
                <h5 className="font-semibold text-16 text-secondary-full-opacity ">
                  {translate('label.orderDetails.orderDetailsHeadingText')}
                </h5>
                {details?.parentCustomNo?.length != 0 && (
                  <>
                    <p className="text-sm text-black-light mob-font-14">
                      {translate('label.orderDetails.replacementOrderText')} </p>
                  </>
                )}
                <p className="text-sm text-black-light">
                  #{details?.orderNo} • {details?.items?.length}{' '}
                  {details?.items?.length > 1 ? (
                    <span>{translate('common.label.itemPluralText')}</span>
                  ) : (
                    <span>{translate('common.label.itemSingularText')}</span>
                  )}
                </p>
                {details?.parentCustomNo?.length != 0 && (
                  <>
                    <p className="font-bold font-10 text-black-light">
                      {translate('label.orderDetails.originalOrderText')} {details?.parentCustomNo}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="hidden sm:block">
              <h5 className="uppercase font-10 text-black-light">
                {translate('label.orderDetails.orderPlacedOnHeadingText')} </h5>
              <p className="text-sm dark:text-black text-primary">
                {moment(new Date(details?.orderDate)).format(DATE_FORMAT)}
              </p>
            </div>
            <div className="hidden sm:block">
              <h5 className="text-black font-10 text-black-light">
                {translate('label.orderDetails.orderTotalHeadingText')} </h5>
              <p className="text-sm dark:text-black text-primary">
                {priceFormat(
                  details?.grandTotal?.raw?.withTax,
                  undefined,
                  details?.grandTotal?.currencySymbol
                )}
              </p>
            </div>
          </div>
          <div className="flex justify-between py-4 mt-4 border-t sm:pl-16 xsm:pl-16 sm:hidden full-m-ex-header">
            <div className="">
              <h3 className="font-10 text-black-light uppercase !text-sm">
                {translate('label.orderDetails.orderPlacedOnHeadingText')} </h3>
              <p className="text-sm text-primary">
                {moment(new Date(details?.orderDate)).format(DATE_FORMAT)}
              </p>
            </div>
            <div className="">
              <h3 className="font-10 text-black-light !text-sm">{translate('label.orderDetails.orderTotalHeadingText')}</h3>
              <p className="text-sm text-primary">
                {details?.grandTotal?.formatted?.withTax}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="m-0 section-devider"></div>
      </div>

      {/* addresss section start */}
      <div className="w-full py-6">
        <div className="w-full">
          <div className="w-full">
            <h4 className="mb-2 text-base font-semibold text-primary text dark:text-black">
              {' '}
              {translate('label.orderDetails.deliveryAddressHeadingText')} </h4>
            <h5 className="mb-1 text-sm text-primary dark:text-black">
              {details?.customer?.label} •{' '}
              {details?.customer?.firstName}{' '}
              {details?.customer?.lastName}
            </h5>
            <div className="pl-2">
              <p className="mb-1 text-sm font-normal text-black dark:text-black">
                {details?.billingAddress?.address1}{' '}
                {details?.billingAddress?.address2}
              </p>
              <p className="mb-1 text-sm font-normal text-black dark:text-black">
                {details?.billingAddress?.city} -{' '}
                {details?.billingAddress?.postCode}
              </p>
              <p className="text-sm font-normal text-black dark:text-black">
                {details?.billingAddress?.phoneNo}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="m-0 section-devider"></div>
      </div>
    </>
  )
}

export default OrderDetailHeader
