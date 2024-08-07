import { DATE_FORMAT } from "@components/utils/constants";
import { priceFormat } from "@framework/utils/parse-util";
import moment from "moment";
import React from "react";
import { useTranslation } from '@commerce/utils/use-translation'

const TrackingDetail = ({ deliveryPlan }: any) => {
   const translate = useTranslation()
   return (
      <>
      <div className='w-full px-4 pt-6 pb-0 sm:px-0'>
      {
         deliveryPlan?.trackingNo && (
               <div className='flex justify-between'>
                  <div className='w-full'>
                     <h3 className='mb-1 text-gray-700 font-10'>{translate('label.orderDetails.courierPartnerHeadingText')}</h3>
                     <p className='text-black dark:text-black'>{deliveryPlan?.carrierCode}</p>
                  </div>
                  <div className='w-full'>
                     <h3 className='mb-1 text-gray-700 font-10'>{translate('label.orderDetails.awbNumberHeadingText')}</h3>
                     <p className='text-black text-sm font-normal dark:text-black'>#{deliveryPlan?.trackingNo}</p>
                  </div>
               </div>
         )
      }
      </div>
      
      </>
   )
}

export default TrackingDetail;

