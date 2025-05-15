import { getOrderId } from "@framework/utils/app-util";
import { AnalyticsEventType } from "..";
import { EmptyString } from "@components/utils/constants";

export const MAPP_ANALYTICS_EVENTS: any = {
    /**
     * All events supported for Mapp Analytics tracking
     */
    eventTypes: {
        [AnalyticsEventType.ADD_TO_BASKET]: 'add_to_cart_mapp',
        [AnalyticsEventType.PURCHASE]: 'purchase_mapp',
    },

    // Event mappings for Mapp
    events: {

        /**
         * Event: Add to Cart
         */
        [AnalyticsEventType.ADD_TO_BASKET]: {
            transformMap: {
                event: 'add_to_cart_mapp',
                ecommerce: (source: any) => ({
                    items: source?.cartItems?.lineItems?.length
                        ? source?.cartItems?.lineItems?.map(
                            (item: any, itemId: number) => ({
                                item_id: item?.stockCode,
                                item_name: item?.name,
                                affiliation: "Park Cameras",
                                item_brand: item?.brand,
                                item_category: item?.categoryItems?.length ? item?.categoryItems[0]?.categoryName : item?.classification?.category,
                                price: item?.price?.raw?.withTax,
                                currency: source?.cartItems?.baseCurrency,
                                quantity: item?.qty,
                            }))
                        : new Array<any>(),
                }),
            },
        },

        /**
         * Event: Purchase
         */
        [AnalyticsEventType.PURCHASE]: {
            transformMap: {
                event: 'purchase_mapp',
                ecommerce: (source: any) => ({
                    transaction_id: getOrderId(source?.orderInfo?.order),
                    affiliation: 'Park Cameras',
                    value: source?.cartItems?.grandTotal?.raw?.withTax,
                    shipping: source?.cartItems?.shippingCharge?.raw?.withTax,
                    currency: source?.cartItems?.baseCurrency,
                    items: source?.cartItems?.lineItems?.length
                        ? source?.cartItems?.lineItems?.map(
                            (item: any, itemId: number) => ({
                                item_id: item?.stockCode,
                                item_name: item?.name,
                                item_brand: item?.brand,
                                item_category: item?.categoryItems?.length ? item?.categoryItems[0]?.categoryName : item?.classification?.category,
                                price: item?.price?.raw?.withTax,
                                quantity: item?.qty,
                            }))
                        : new Array<any>(),
                }),
            },
        },
    },
};
