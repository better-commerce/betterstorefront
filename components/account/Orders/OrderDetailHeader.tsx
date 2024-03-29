import { DATE_FORMAT } from '@components/utils/constants'
import { priceFormat } from '@framework/utils/parse-util'
import moment from 'moment'
import React from 'react'

const OrderDetailHeader = ({ details, showDetailedOrder }: any) => {
  return (
    <>
      <div className="w-full pb-6 o-detail-header">
        <div className="sm:pl-8 sm:pt-5 pt-5">
          <div className="flex justify-between">
            <div className="relative pl-9">
              <a
                href="#"
                className="absolute left-0 top-2/4 -translate-y-2/4 "
                onClick={() => showDetailedOrder(false)}
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
                //let orderLabel = "Order Details";
              }

              <div className="w-full">
                <h5 className="font-bold text-16 text-secondary-full-opacity ">
                  Order Details
                </h5>
                {details?.order?.parentCustomNo?.length != 0 && (
                  <>
                    <p className="text-sm text-black-light mob-font-14">
                      Replacement Order
                    </p>
                  </>
                )}
                <p className="text-sm text-black-light">
                  #{details?.order.orderNo} • {details?.order?.items?.length}{' '}
                  {details?.order?.items?.length > 1 ? (
                    <span>ITEMS</span>
                  ) : (
                    <span>ITEM</span>
                  )}
                </p>
                {details?.order?.parentCustomNo?.length != 0 && (
                  <>
                    <p className="font-bold font-10 text-black-light">
                      Original Order: {details?.order.parentCustomNo}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="hidden sm:block">
              <h5 className="uppercase font-10 text-black-light">
                Order PLACED ON
              </h5>
              <p className="text-sm dark:text-black text-primary">
                {moment(new Date(details?.order.orderDate)).format(DATE_FORMAT)}
              </p>
            </div>
            <div className="hidden sm:block">
              <h5 className="text-black font-10 text-black-light">
                ORDER TOTAL
              </h5>
              <p className="text-sm dark:text-black text-primary">
                {priceFormat(
                  details?.order.grandTotal?.raw?.withTax,
                  undefined,
                  details?.order?.grandTotal?.currencySymbol
                )}
              </p>
            </div>
          </div>
          <div className="flex justify-between py-4 mt-4 border-t sm:pl-16 xsm:pl-16 sm:hidden full-m-ex-header">
            <div className="">
              <h3 className="font-10 text-black-light uppercase !text-sm">
                Order PLACED ON
              </h3>
              <p className="text-sm text-primary">
                {moment(new Date(details?.order.orderDate)).format(DATE_FORMAT)}
              </p>
            </div>
            <div className="">
              <h3 className="font-10 text-black-light !text-sm">ORDER TOTAL</h3>
              <p className="text-sm text-primary">
                {details?.order?.grandTotal?.formatted?.withTax}
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
        <div className="o-detail-continer">
          <div className="w-full">
            <h4 className="mb-2 text-base font-bold text-primary text dark:text-black">
              {' '}
              Delivery Address
            </h4>
            <h5 className="mb-1 text-sm text-primary dark:text-black">
              {details?.order?.customer?.label} •{' '}
              {details?.order?.customer?.firstName}{' '}
              {details?.order?.customer?.lastName}
            </h5>
            <div className="pl-2">
              <p className="mb-1 text-sm font-normal text-black dark:text-black">
                {details?.order?.billingAddress?.address1}{' '}
                {details?.order?.billingAddress?.address2}
              </p>
              <p className="mb-1 text-sm font-normal text-black dark:text-black">
                {details?.order?.billingAddress?.city} -{' '}
                {details?.order?.billingAddress?.postCode}
              </p>
              <p className="text-sm font-normal text-black dark:text-black">
                {details?.order?.billingAddress?.phoneNo}
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
