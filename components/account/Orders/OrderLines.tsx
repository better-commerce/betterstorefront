import React from "react";
import { DATE_FORMAT } from "@components/utils/constants";
import moment from "moment";
import Image from "next/image";
import OrderStatusMapping from "./OrderStatusMapping";
import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";

const OrderLines = ({ order, item, idx, trackPackage, groups }: any) => {
   let totalQty =0;
   order?.itemsBasic?.forEach((x: any) => {totalQty = totalQty+ x.qty;}); 
   let itemLabel = order?.itemsBasic?.length > 1 ? "ITEMS" : "ITEM";
   let unitLabel = totalQty > 1 ? "UNITS" : "UNIT";
   return (
      <>
         <div className='w-full p-4 border-b-2 border-dotted order-info-top'>
            <p className='text-sm font-medium order-number text-black'>
               #{order.orderNo}{' '} • {' '}{order?.itemsBasic?.length} {itemLabel} • {' '} {totalQty} {unitLabel}
            </p>
            {/* <button type="button" className='text-base font-bold text-black order-link'>
               {
                  Object.entries(groups).map(([key, values]: any, iid: number) => {
                     let itemQty =0;
                     groups[key].forEach((x: any) => {itemQty = itemQty+ x.qty;}); 
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
                           {order?.orderDetails?.order?.deliveryPlans?.length > 0 ? (
                              <span>Package {idx + 1}/{order?.orderDetails?.order?.deliveryPlans?.length} • </span>
                           ) : (
                              <span>Package {idx + 1}/1 • </span>
                           )}

                           <span className='mx-2'>{order?.orderDetails?.order?.items?.length > 1
                              ? <span>Items</span>
                              : <span>Item</span>
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
                     orderStatusDisplay={order.orderStatusDisplay}
                     orderStatusRag={order.orderStatusRag}
                  />
               </div>
            </div>

            <div className='w-full py-2 order-image-sec'>
               {order?.itemsBasic?.map((item: any, ldx: number) => (
                  <a href={`/${item.slug}`} className='inline-block order-image-nonslider' key={ldx}>
                     <img
                        src={generateUri(item?.image,'h=72&fm=webp')||IMG_PLACEHOLDER} 
                        alt=""
                        width={40}
                        height={72}
                        className='object-cover object-center w-full h-full radius-xs sm:h-full'>
                     </img>
                  </a>
               ))}
            </div>

            {
               order.allowedToTrack
                  ? <div className='w-full acc-btn-sec'>
                     <a onClick={() => trackPackage(order)} target="_blank" rel="noopener noreferrer" href={`https://track.damensch.com/?waybill=${order.trackingNo}`} className='inline-block px-8 py-4 text-sm font-semibold text-center text-white bg-black border link-btn'>Track Package {idx + 1}</a>
                  </div>
                  : null
            }
         </div>
      </>
   )
}

export default OrderLines;

