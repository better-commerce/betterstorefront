import React from "react";
import { DATE_FORMAT } from "@components//utils/constants";
import moment from "moment";
import OrderStatusMapping from "./OrderStatusMapping";
import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components//utils/textVariables";
import { useTranslation } from '@commerce/utils/use-translation'

const OrderLines = ({ order, item, idx, trackPackage, groups }: any) => {
   const translate = useTranslation()
   let totalQty = 0;
   order?.itemsBasic?.forEach((x: any) => { totalQty = totalQty + x.qty; });
   let itemLabel = order?.itemsBasic?.length > 1 ? "ITEMS" : "ITEM";
   let unitLabel = totalQty > 1 ? "UNITS" : "UNIT";
   return (
      <>
         <div className="flex flex-col p-4 border-b sm:flex-row sm:justify-between border-slate-200 rounded-t-2xl sm:items-center sm:p-4 bg-slate-50 dark:bg-slate-500/5">
            <div>
               <p className="text-lg font-semibold">#{order.orderNo}{' '} • {' '}{item?.items?.length} {itemLabel} • {' '} {totalQty} {unitLabel}</p>
               <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
                  <span> {moment(new Date(order?.orderDate)).format(DATE_FORMAT)}</span>
               </p>
            </div>
            <div className="mt-3 sm:mt-0">
               <button type="button" className="nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm font-medium py-2.5 px-4 sm:px-6  ttnc-ButtonSecondary bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800  border border-slate-300 dark:border-slate-700  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0" > View Order</button>
            </div>
         </div>
         {/* top info end */}

         {/* bottom info start */}
         <div className='w-full p-4 order-info-bottom'>
            <div className="flex justify-between">
               <div>
                  {
                     order?.orderDetails?.order?.id && (
                        <p className='text-sm font-medium text-black'>
                           {order?.orderDetails?.order?.deliveryPlans?.length > 0 ? (
                              <span>{translate('label.orderDetails.packageText')} {idx + 1}/{order?.orderDetails?.order?.deliveryPlans?.length} • </span>
                           ) : (
                              <span>{translate('label.orderDetails.packageText')} {idx + 1}/1 • </span>
                           )}

                           <span className='mx-2'>{order?.orderDetails?.order?.items?.length > 1
                              ? <span>{translate('common.label.itemPluralText')}</span>
                              : <span>{translate('common.label.itemSingularText')}</span>
                           }: {order?.orderDetails?.order?.items?.length}</span>
                           {
                              order?.showETA && (
                                 item?.deliveryDateTarget ?
                                    (
                                       <span className="eta-span"> <span className="span-dot-eta">•</span> ETA: {moment(new Date(item?.deliveryDateTarget)).format(DATE_FORMAT)}</span>
                                    ) : (
                                       <span className="eta-span"> <span className="span-dot-eta">•</span> ETA: {moment(new Date(order?.dueDate)).format(DATE_FORMAT)}</span>
                                    )
                              )
                           }
                        </p>
                     )
                  }
               </div>
               <div className='flex items-center justify-end pb-2'>
                  <OrderStatusMapping
                     orderStatusDisplay={order?.orderStatusDisplay}
                     orderStatusRag={order?.orderStatusRag}
                  />
               </div>
            </div>
            <div className='grid w-full grid-cols-6 gap-2 py-2 order-image-sec'>
               {
                  order?.itemsBasic?.map((productItem: any, pId: number) => (
                     <a href={`/${productItem?.slug}`} className='inline-block p-2 border border-gray-200 bg-slate-100 rounded-2xl order-image-nonslider' key={pId}>
                        <img src={generateUri(productItem?.image, 'h=720&fm=webp') || productItem?.image || IMG_PLACEHOLDER} alt="product-image" width={40} height={72} className='object-cover object-center w-full h-full radius-xs sm:h-full' />
                     </a>
                  ))
               }
            </div>

            {order.allowedToTrack &&
               <div className='w-full acc-btn-sec'>
                  <a onClick={() => trackPackage(order)} target="_blank" rel="noopener noreferrer" href={`https://track.damensch.com/?waybill=${order.trackingNo}`} className='inline-block px-8 py-4 text-sm font-semibold text-center text-white bg-black border link-btn'>Track Package {idx + 1}</a>
               </div>
            }
         </div>
      </>
   )
}

export default OrderLines;

