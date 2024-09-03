import { DATE_FORMAT } from '@components/utils/constants'
import { priceFormat } from '@framework/utils/parse-util'
import moment from 'moment'
import React from 'react'
import { useTranslation } from '@commerce/utils/use-translation'
import { useRouter } from 'next/router'
import { isB2BUser } from '@framework/utils/app-util'
import { useUI } from '@components/ui'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
const OrderDetailHeader = ({ details, showDetailedOrder }: any) => {
  const translate = useTranslation();
  const router = useRouter();
  const { user } = useUI()
  const isB2B = isB2BUser(user)
  return (
    <>
      <ol role="list" className="flex items-center space-x-0 sm:space-x-0 sm:mb-4 sm:px-0 md:px-0 lg:px-0 2xl:px-0" >
        <li className='flex items-center text-10-mob sm:text-sm'>
          <Link href="/my-account/orders" passHref>
            <span className="font-light hover:text-gray-900 dark:text-slate-500 text-slate-500" >Orders</span>
          </Link>
        </li>
        <li className='flex items-center text-10-mob sm:text-sm'>
          <span className="inline-block mx-1 font-normal hover:text-gray-900 dark:text-black" >
            <ChevronRightIcon className='w-3 h-3'></ChevronRightIcon>
          </span>
        </li>
        <li className="flex items-center text-10-mob sm:text-sm" >
          <span className={`font-semibold hover:text-gray-900 capitalize dark:text-black`} >
            {details?.orderNo}
          </span>
        </li>
      </ol>
      <div className='mb-4'>
        <h1 className="text-2xl font-semibold sm:text-3xl dark:text-black">
          {details?.orderNo && "Order #" + details?.orderNo}
        </h1>
      </div>
      <div className="flex flex-col"><hr className="my-2 border-dashed border-slate-200 dark:border-slate-700" /></div>
      <div className="w-full pb-2">
        <div className="w-full">
          <div className="flex justify-between">
            <div className="relative">
              <div className="w-full">
                <h5 className="font-bold text-18 text-secondary-full-opacity ">
                  {translate('label.orderDetails.orderDetailsHeadingText')}
                </h5>
                {details?.parentCustomNo?.length != 0 && (
                  <>
                    <p className="text-sm text-black-light mob-font-14">
                      {translate('label.orderDetails.replacementOrderText')} </p>
                  </>
                )}
                <p className="text-sm text-black-light dark:text-gray-900">
                  {details?.items?.length}{' '}
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
              <h5 className="uppercase font-10 text-black-light dark:text-gray-900">
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
              <h3 className="font-10 text-black-light uppercase !text-sm dark:text-black">
                {translate('label.orderDetails.orderPlacedOnHeadingText')} </h3>
              <p className="text-sm text-primary dark:text-gray-700">
                {moment(new Date(details?.orderDate)).format(DATE_FORMAT)}
              </p>
            </div>
            <div className="">
              <h3 className="font-10 text-black-light !text-sm dark:text-black">{translate('label.orderDetails.orderTotalHeadingText')}</h3>
              <p className="text-sm text-primary dark:text-gray-700">
                {details?.grandTotal?.formatted?.withTax}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <hr className="my-2 border-dashed border-slate-200 dark:border-slate-700"></hr>
      </div>

      {/* address section start */}
      <div className="w-full py-3">
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
      <div className="flex flex-col">
        <hr className="my-2 border-dashed border-slate-200 dark:border-slate-700"></hr>
      </div>
    </>
  )
}

export default OrderDetailHeader
