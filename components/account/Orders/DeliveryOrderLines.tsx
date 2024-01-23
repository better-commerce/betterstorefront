import { DATE_TIME_FORMAT, DATE_FORMAT } from "@components/utils/constants";
import { CheckIcon, ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { AuBankAccountElement } from "@stripe/react-stripe-js";
import { groupBy } from "lodash";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import OrderStatusMapping from "./OrderStatusMapping";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import { generateUri } from '@commerce/utils/uri-util'
const DeliveryOrderLines = ({ order, item, idx, trackPackage, groups }: any) => {
   let totalQty = 0;
   item?.items?.forEach((x: any) => { totalQty = totalQty + x.qty; });
   let itemLabel = item?.items?.length > 1 ? "ITEMS" : "ITEM";
   let unitLabel = totalQty > 1 ? "UNITS" : "UNIT";

   const getProductItems = () => {
      let arrStockCodes = item?.items?.map((line: any) => line.stockCode);
      return order?.itemsBasic?.filter((x: any) => arrStockCodes?.includes(x?.stockCode));
   };

   const getCategories = () => {
      return groupBy(getProductItems(), 'category');
   }

   return (
      <>
         <div className='w-full p-4 border-b-2 border-dotted order-info-top'>
            <p className='text-sm font-medium order-number text-black'>
               #{order.orderNo}{' '} • {' '}{item?.items?.length} {itemLabel} {idx} • {' '} {totalQty} {unitLabel}
            </p>
            {/* <button type="button" className='text-base font-bold text-black order-link'>
               {
                  Object.entries(getCategories()).map(([key, values]: any, iid: number) => {
                     let itemQty = 0;
                     getCategories()[key].forEach((x: any) => { itemQty = itemQty + x.qty; });
                     return (
                        <>
                           <span
                              key={iid}
                              className='object-cover object-center w-full h-full mr-2 text-primary dark:text-black radius-xs sm:h-full cat-span'>
                              {itemQty} {key.toLowerCase()}
                              <span className='comma-span'>,</span>
                              <span className='hidden ml-2 arrow-span'><i className='sprite-icon sprite-right-arrow-black'></i></span>
                           </span>
                        </>
                     )
                  })
               }
            </button> */}
         </div>
         {/* top info end */}

         {/* bottom info start */}
         <div className='w-full p-4 order-info-bottom'>
            <div className="flex justify-between">
               <div>
                  {
                     order?.orderDetails?.order?.id && (
                        <p className='text-sm text-black font-medium'>
                           {order?.orderDetails?.order?.deliveryPlans.length > 0 ? (
                              <>
                              <span>Package {idx + 1}/{order?.orderDetails?.order?.deliveryPlans.length} • </span>
                              </>
                           ) : (
                              <span>Package {idx + 1}/1 • </span>
                           )}

                           <span className='mx-2'>{item?.items?.length > 1
                              ? <span>Items</span>
                              : <span>Item</span>
                           }: {item?.items?.length}</span>
                           {
                              item?.showETA && (
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
                     orderStatusDisplay={item?.orderStatusDisplay || order?.orderStatusDisplay}
                     orderStatusRag={item?.orderStatusRag || order.orderStatusRag}
                  />
               </div>
            </div>
            <div className='w-full py-2 order-image-sec'>
               {
                  getProductItems()?.map((productItem: any, pId: number) => (
                     <a href={`/${productItem.slug}`} className='inline-block order-image-nonslider' key={pId}>
                     <img
                        src={generateUri(productItem.image,'h=72&fm=webp') || productItem.image||IMG_PLACEHOLDER}
                        alt="product-image"
                        width={40}
                        height={72}
                        className='object-cover object-center w-full h-full radius-xs sm:h-full'/>
                     </a>
               ))
               }
            </div>
            {
               item?.trackingLink && (
                  order.allowedToTrack
                     ? <div className='w-full acc-btn-sec'>
                        <a onClick={() => trackPackage(order)} href={item?.trackingLink} target="_blank" rel="noopener noreferrer" className='inline-block px-8 py-4 text-sm font-semibold text-center text-white bg-black border link-btn'>Track Package {idx + 1}</a>
                     </div>
                     : null
               )
            }
         </div>
      </>
   )
}

export default DeliveryOrderLines;

