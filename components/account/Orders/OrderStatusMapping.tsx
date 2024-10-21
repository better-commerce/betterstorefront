// Base Imports
import React from "react";

const OrderStatusMapping = ({ orderStatusDisplay, orderStatusRag,isTabular }: any) => {
    let cssClass = "";

    switch(orderStatusRag){
        case "red":
            cssClass = "label-Cancelled";
            break;
        case "amber":
            cssClass = "label-pending";
            break;
        case "green":
            cssClass = "label-confirmed";
            break;
    }
    
    //console.log("ORDER-STATUS",orderStatus);
    return (
        <>
            <label className={`${isTabular ? 'px-2 py-1 text-xs rounded-full':'px-4 py-3 text-sm rounded-lg'} font-semibold leading-none truncate ${cssClass}`}>
                {orderStatusDisplay}
            </label>
        </>
    );
}

export default OrderStatusMapping;