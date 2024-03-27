import { /**OrderLogStatus, */ DATE_TIME_FORMAT } from "@new-components/utils/constants";
import { /**utcDateConvert, stringToNumber, localDateToConvert, */ utcToLocalDate } from "@framework/utils/parse-util";
import { CheckIcon, ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import React, { useEffect, useState } from "react";

const OrderLog = ({ orderLog, orderJourney, deliveryPlanId }: any) => {
   //console.log("ORDER_LOG_PROPS",orderLog,orderStatus)

   //only use those entries where orderlineId is blank. orderline specific elements NOT to be shown in standard order journey
   orderJourney = orderJourney?.filter((s: any) => s?.orderLineId == "00000000-0000-0000-0000-000000000000");

   const filteredJourney = orderJourney?.filter((s: any) => (s?.deliveryPlanId == deliveryPlanId || s?.deliveryPlanId == "00000000-0000-0000-0000-000000000000"));

   const oneTreeNode = (label: string, ragStatus: string = "", timestamp: any = "", isCompleted: boolean) => {
      const cssClass = ragStatus == "red" ? "cancelled" : ragStatus == "amber" ? "" : "completed";
      return (
         <div className={`w-full order-track-step ${cssClass}`}>
            <div className="order-track-status">
               <span className="order-track-status-dot !mt-2">
                  <span className='leading-none check-s-icon'>
                     {cssClass === 'cancelled' ? <XMarkIcon className="inline-block w-4 h-4 text-white" /> : <CheckIcon className="inline-block w-4 h-4 text-white" />}
                  </span>
               </span>
               <span className="order-track-status-line"></span>
            </div>
            <div className="order-track-text">
               <p className="order-track-text-stat text-black font-semibold">
                  <label>{label}</label>
               </p>
               <p className="text-black order-track-text-stat font-normal">
                  {timestamp != "0001-01-01T00:00:00" ? moment(utcToLocalDate(new Date(timestamp))).format(DATE_TIME_FORMAT) : "-"}                 
               </p>
            </div>
         </div>
      )
   }
   return (
      <>
         {
            filteredJourney?.length > 0 ?
               filteredJourney?.map((s: any) => oneTreeNode(s?.displayLabel, s?.ragStatus, s?.timeStamp, s?.isCompleted)) :
               orderJourney?.map((s: any) => oneTreeNode(s?.displayLabel, s?.ragStatus, s?.timeStamp, s?.isCompleted))
         }
      </>
   )
}

export default OrderLog;

