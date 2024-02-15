import { DATE_FORMAT } from "@components/utils/constants";
import { groupBy } from "lodash";
import moment from "moment";
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
            <p className='text-sm font-medium text-black order-number'>
               #{order.orderNo}{' '} • {' '}{item?.items?.length} {itemLabel} • {' '} {totalQty} {unitLabel}
            </p>
         </div>
         {/* top info end */}

         {/* bottom info start */}
         <div className='w-full p-4 order-info-bottom'>
            <div className="flex justify-between">
               <div>
                  {
                     order?.orderDetails?.order?.id && (
                        <p className='text-sm font-medium text-black'>
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
            <div className='grid w-full grid-cols-6 gap-2 py-2 order-image-sec'>
               {
                  getProductItems()?.map((productItem: any, pId: number) => (
                     <a href={`/${productItem.slug}`} className='inline-block border border-gray-200 order-image-nonslider' key={pId}>
                        <img src={generateUri(productItem.image, 'h=720&fm=webp') || productItem.image || IMG_PLACEHOLDER} alt="product-image" width={40} height={72} className='object-cover object-center w-full h-full radius-xs sm:h-full' />
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

