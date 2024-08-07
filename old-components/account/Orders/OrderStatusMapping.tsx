// Base Imports
import React from "react";

const OrderStatusMapping = ({ orderStatusDisplay, orderStatusRag }: any) => {
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
            <label className={`px-4 py-3 text-sm font-semibold leading-none truncate rounded-lg ${cssClass}`}>
                {orderStatusDisplay}
            </label>
        </>
    );
}

export default OrderStatusMapping;