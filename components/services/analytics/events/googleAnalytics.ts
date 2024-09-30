import { EmptyObject, EmptyString } from "@components/utils/constants";
import { AnalyticsEventType } from "..";
import { GTMUniqueEventID } from "../ga4";
import { Guid } from "@commerce/types";
import { getOrderId } from "@framework/utils/app-util";

export const GOOGLE_ANALYTICS_EVENTS: any = {

    /**
     * All events supported for Google Analytics tracking
     */
    eventTypes: {
        [AnalyticsEventType.VIEW_PLP_ITEMS]: 'view_item_list',
        [AnalyticsEventType.VIEW_BASKET]: 'view_cart',
        [AnalyticsEventType.ADD_TO_BASKET]: 'add_to_cart',
        [AnalyticsEventType.REMOVE_FROM_CART]: 'remove_from_cart',
        [AnalyticsEventType.SELECT_QUANTITY]: 'select_quantity',
        [AnalyticsEventType.SAVE_NEW_ADDRESS]: 'save_new_address',
        [AnalyticsEventType.VIEW_WISHLIST]: 'wishlist',
        [AnalyticsEventType.ADD_TO_WISHLIST]: 'add_to_wishlist',
        [AnalyticsEventType.REMOVE_FROM_WISHLIST]: 'remove_item',
        [AnalyticsEventType.ADDRESS_CHANGE]: 'address_changes',
        [AnalyticsEventType.PDP_VIEW]: 'view_item',
        [AnalyticsEventType.PDP_VIEW_DETAILS]: 'select_item',
        [AnalyticsEventType.PDP_QUICK_VIEW]: 'popup_view',
        [AnalyticsEventType.PDP_QUICK_VIEW_CLICK]: 'quick_view_click',
        [AnalyticsEventType.VIEW_PRODUCT_DETAILS]: 'view_prod_details',
        [AnalyticsEventType.SPECIFICATION_PRODUCT_DETAIL]: 'specification_product_detail',
        [AnalyticsEventType.BEGIN_CHECKOUT]: 'begin_checkout',
        [AnalyticsEventType.ADD_SHIPPING_INFO]: 'add_shipping_info',
        [AnalyticsEventType.ADD_PAYMENT_INFO]: 'add_payment_info',
        [AnalyticsEventType.PURCHASE]: 'purchase',
        [AnalyticsEventType.HELP_ICON]: 'help_icon',
        [AnalyticsEventType.HAMBURGER_MENU]: 'hamburger_menu',
        [AnalyticsEventType.HAMBURGER_MENU_CLICK]: 'hamburger_menu_click',
        [AnalyticsEventType.HAMBURGER_ICON_CLICK]: 'hamburger_icon_click',
        [AnalyticsEventType.HELP_SIDEBAR_MENU]: 'help_sidebar_menu',
        [AnalyticsEventType.NEED_HELP_WITH_ORDER]: 'need_help_with_your_order',
        [AnalyticsEventType.PROCEED_TO_CANCEL_ITEM]: 'proceed_to_cancel_item',
        [AnalyticsEventType.PROCEED_TO_CANCEL_ORDER]: 'proceed_to_cancel_order',
        [AnalyticsEventType.PROCEED_TO_RETURN]: 'proceed_to_return',
        [AnalyticsEventType.PROCEED_TO_EXCHANGE]: 'proceed_to_exchange',
        [AnalyticsEventType.CANCEL_CONFIRM]: 'cancel_confirm',
        [AnalyticsEventType.RETURN_CONFIRM]: 'return_confirm',
        [AnalyticsEventType.TRACK_PACKAGE]: 'track_package',
        [AnalyticsEventType.FOOTER_QUERY_CLICK]: 'footer_query_click',
        [AnalyticsEventType.LOGIN_ATTEMPT]: 'login_attempt',
        [AnalyticsEventType.NOTIFY_ME]: 'notify_me',
        [AnalyticsEventType.NOTIFY_CLICK]: 'notify_click',
        [AnalyticsEventType.REFERRER_BANNERS]: 'referrer_banners',
        [AnalyticsEventType.LOGO_CLICK]: 'logo_click',
        [AnalyticsEventType.POLICY_POPUP]: 'policy_popup',
    },

    // Event mappings for GoogleAnalytics
    events: {

        /**
         * Event: View PLP Items
         */
        [AnalyticsEventType.VIEW_PLP_ITEMS]: {
            transformMap: {
                originalLocation: (source: any) => `${source?.originalLocation}`,
                event: AnalyticsEventType.VIEW_PLP_ITEMS,
                gtm: { uniqueEventId: GTMUniqueEventID.VIEW_ITEM_LIST, start: new Date().getTime() },
                ecommerce: (source: any) => ({
                    items: source?.product?.results?.length
                        ? source?.product?.results?.map((item: any, itemId: number) => ({
                            item_id: item?.sku,
                            item_name: item?.name,
                            Affliation: "Fashion Store",
                            Coupon: "",
                            discount: "",
                            index: itemId + 1,
                            item_brand: item?.brand,
                            item_list_id: source?.plpDetails?.id,
                            item_list_name: source?.plpDetails?.name,
                            item_variant: item?.variantGroupCode,
                            price: item?.price?.raw?.withTax,
                            quantity: 1,
                            item_is_bundle_item: source?.itemIsBundleItem,
                        }))
                        : new Array<any>(),
                }),
            },
        },

        /**
         * Event: View Cart
         */
        [AnalyticsEventType.VIEW_BASKET]: {
            transformMap: {
                originalLocation: (source: any) => `${source?.originalLocation}`,
                event: AnalyticsEventType.VIEW_BASKET,
                gtm: { uniqueEventId: GTMUniqueEventID.VIEW_CART, start: new Date().getTime() },
                crto: (source: any) => ({
                    email: "",
                    products: source?.cartItems?.lineItems?.length
                        ? source?.cartItems?.lineItems?.map((item: any, itemId: number) => (item?.sku))
                        : new Array<any>(),
                }),
                ecommerce: (source: any) => ({
                    items: source?.cartItems?.lineItems?.length
                        ? source?.cartItems?.lineItems?.map((item: any, itemId: number) => ({
                            item_id: item?.stockCode || item?.sku,
                            item_name: item?.name,
                            Affliation: "Fashion Store",
                            Coupon: "",
                            discount: source?.cartItems?.discount?.raw?.withTax,
                            index: itemId,
                            item_list_id: item?.stockCode || item?.sku,
                            item_list_name: source?.itemListName || (item?.categoryItems?.length ? item?.categoryItems[0]?.categoryName : ''),
                            item_variant: item?.colorName,
                            item_brand: item?.brand,
                            item_category2: item?.categoryItems?.length ? item?.categoryItems[1]?.categoryName : '',
                            quantity: item?.qty,
                            item_var_id: item?.stockCode,
                            item_is_bundle_item: source?.itemIsBundleItem,
                            price: item?.price?.raw?.withTax,
                            item_category: item?.categoryItems?.length ? item?.categoryItems[0]?.categoryName : '',
                        }))
                        : new Array<any>(),
                    current_page: source?.currentPage,
                })
            },
        },

        /**
         * Event: Add to Cart
         */
        [AnalyticsEventType.ADD_TO_BASKET]: {
            transformMap: {
                originalLocation: (source: any) => `${source?.originalLocation}`,
                event: AnalyticsEventType.ADD_TO_BASKET,
                gtm: { uniqueEventId: GTMUniqueEventID.ADD_TO_CART, start: new Date().getTime() },
                ecommerce: (source: any) => ({
                    currency: `${source?.price?.currencySymbol}`,
                    value: `${source?.price?.raw?.withTax}`,
                    items: [
                        {
                            item_id: `${source?.stockCode}`,
                            item_name: `${source?.name}`,
                            Affliation: "Fashion Store",
                            Coupon: "",
                            discount: "",
                            index: 0,
                            item_list_name: `${source?.classification?.mainCategoryName}`,
                            item_list_id: `${source?.itemListId || source?.stockCode}`,
                            item_variant: `${source?.variantGroupCode}`,
                            item_brand: `${source?.brand}`,
                            quantity: 1,
                            item_is_bundle_item: source?.itemIsBundleItem,
                            price: `${source?.price?.raw?.withTax}`,
                            item_category: `${source?.classification?.category}`
                        },
                    ],
                }),
                currency: (source: any) => `${source?.price?.currencySymbol}`,
                value: (source: any) => `${source?.cartItems?.grandTotal?.raw?.withTax}`,
                add_to_cart_type: (source: any) => source?.addToCartType,
            },
        },

        /**
         * Event: Remove from Cart
         */
        [AnalyticsEventType.REMOVE_FROM_CART]: {
            transformMap: {
                originalLocation: (source: any) => `${source?.originalLocation}`,
                event: AnalyticsEventType.REMOVE_FROM_CART,
                gtm: { uniqueEventId: GTMUniqueEventID.REMOVE_FROM_CART, start: new Date().getTime() },
                crto: (source: any) => ({
                    email: "",
                    products: source?.cartItems?.lineItems?.length
                        ? source?.cartItems?.lineItems?.map((item: any, itemId: number) => ({
                            id: item?.sku,
                            price: item?.price?.raw?.withTax,
                            quantity: item?.qty,
                        }))
                        : new Array<any>(),
                }),
                ecommerce: (source: any) => ({
                    items: [
                        {
                            item_id: source?.sku,
                            item_name: source?.name,
                            Affliation: "Fashion Store",
                            Coupon: "",
                            discount: "",
                            index: 1,
                            item_list_id: source?.stockCode,
                            item_list_name: source?.itemListName,
                            item_variant: source?.colorName,
                            item_brand: source?.brand,
                            quantity: source?.qty,
                            item_is_bundle_item: source?.itemIsBundleItem,
                            item_category: source?.categoryItems?.length ? source?.categoryItems[0]?.categoryName : EmptyString,
                            price: source?.price?.raw?.withTax,
                        },
                    ],
                }),
                value: (source: any) => source?.cartItems?.grandTotal?.raw?.withTax,
                currency: (source: any) => `${source?.price?.currencySymbol}`,
            }
        },

        /**
         * Event: Select Quantity
         */
        [AnalyticsEventType.SELECT_QUANTITY]: {
            transformMap: {
                event: AnalyticsEventType.SELECT_QUANTITY,
                category: (source: any) => source?.categoryItems?.length
                    ? source?.categoryItems[0]?.categoryName
                    : EmptyString,
                final_quantity: (source: any) => source?.qty,
                current_page: (source: any) => source.currentPage,
                number_of_plus_clicked: 1,
                number_of_minus_clicked: 0,
            }
        },

        /**
         * Event: Save New Address
         */
        [AnalyticsEventType.SAVE_NEW_ADDRESS]: {
            transformMap: {
                event: AnalyticsEventType.SAVE_NEW_ADDRESS,
                current_page: (source: any) => source.currentPage,
            },
        },

        /**
         * Event: View Wishlist
         */
        [AnalyticsEventType.VIEW_WISHLIST]: {
            transformMap: {
                event: AnalyticsEventType.VIEW_WISHLIST,
                ecommerce: (source: any) => ({
                    header: source?.header,
                    current_page: source?.currentPage,
                }),
            },
        },

        /**
         * Event: Add to Wishlist
         */
        [AnalyticsEventType.ADD_TO_WISHLIST]: {
            transformMap: {
                event: AnalyticsEventType.ADD_TO_WISHLIST,
                ecommerce: (source: any) => ({
                    items: [
                        {
                            item_name: source?.name,
                            item_brand: source?.brand,
                            item_category: source?.classification?.mainCategoryName,
                            item_category2: source?.classification?.category,
                            item_variant: source?.variantGroupCode,
                            quantity: 1,
                            item_id: source?.sku,
                            price: source?.price?.raw?.withTax,
                        },
                    ],
                    item_var_id: source?.stockCode,
                    header: source?.header,
                    current_page: source?.currentPage,
                    availability: source?.productAvailability,
                }),
            }
        },

        /**
         * Event: Remove from Wishlist
         */
        [AnalyticsEventType.REMOVE_FROM_WISHLIST]: {
            transformMap: {
                event: AnalyticsEventType.REMOVE_FROM_WISHLIST,
                product_name: (source: any) => source?.name,
                availability: (source: any) => source?.productAvailability,
                product_id: (source: any) => source?.sku,
            },
        },

        /**
         * Event: Address Change
         */
        [AnalyticsEventType.ADDRESS_CHANGE]: {
            transformMap: {
                event: AnalyticsEventType.ADDRESS_CHANGE,
                delivery_address_name: (source: any) => source?.deliveryAddressName,
                current_page: (source: any) => source?.currentPage,
            },
        },

        /**
         * Event: PDP View
         */
        [AnalyticsEventType.PDP_VIEW]: {
            transformMap: {
                event: AnalyticsEventType.PDP_VIEW,
                originalLocation: (source: any) => `${source?.originalLocation}`,
                gtm: { uniqueEventId: GTMUniqueEventID.VIEW_ITEM, start: new Date().getTime() },
                ecommerce: (source: any) => ({
                    items: {
                        item_id: source?.stockCode,
                        item_name: source?.name,
                        Affliation: "Fashion Store",
                        Coupon: "",
                        discount: "",
                        index: 0,
                        item_brand: source?.brand,
                        item_list_id: "",
                        item_list_name: "",
                        item_category: source?.classification?.mainCategoryName,
                        item_category2: source?.classification?.category,
                        item_variant: source?.color,
                        quantity: 1,
                        item_var_id: source?.stockCode,
                        price: source?.price?.raw?.withTax,
                        item_is_bundle_item: source?.itemIsBundleItem,
                    },
                }),
            },
        },

        /**
         * Event: PDP View Details
         */
        [AnalyticsEventType.PDP_VIEW_DETAILS]: {
            transformMap: {
                event: AnalyticsEventType.PDP_VIEW_DETAILS,
                ecommerce: (source: any) => ({
                    items: [
                        {
                            item_id: source?.sku,
                            item_name: source?.name,
                            price: source?.price?.raw?.withTax,
                            item_brand: source?.brand,
                            item_category: source?.classification?.mainCategoryName,
                            item_category2: source?.classification?.category,
                            item_variant: source?.variantGroupCode,
                            item_list_name: source?.classification?.category,
                            item_list_id: source?.classification?.categoryId,
                            index: source?.position,
                        },
                    ],
                    color: source?.variantGroupCode,
                    position: source?.position,
                    item_var_id: source?.stockCode,
                    current_page: source?.currentPage,
                    section_title: source?.sectionTitle,
                }),
            },
        },

        /**
         * Event: View Product Details
         */
        [AnalyticsEventType.VIEW_PRODUCT_DETAILS]: {
            transformMap: {
                event: AnalyticsEventType.VIEW_PRODUCT_DETAILS,
                category_selected: (source: any) => source?.name,
                header: (source: any) => source?.header,
                current_page: (source: any) => source?.currentPage,
            },
        },

        /**
         * Event: PDP Quick View
         */
        [AnalyticsEventType.PDP_QUICK_VIEW]: {
            transformMap: {
                event: AnalyticsEventType.PDP_QUICK_VIEW,
                product_name: (source: any) => source?.name,
                category: (source: any) => source?.classification?.mainCategoryName,
                page: (source: any) => `${source.originalLocation}`,
                position: (source: any) => source?.position,
                color: (source: any) => source?.variantGroupCode,
                price: (source: any) => source?.price?.raw?.withTax,
                current_page: (source: any) => source?.currentPage,
            },
        },

        /**
         * Event: PDP Quick View
         */
        [AnalyticsEventType.PDP_QUICK_VIEW_CLICK]: {
            transformMap: {
                event: AnalyticsEventType.PDP_QUICK_VIEW_CLICK,
                ecommerce: (source: any) => ({
                    items: {
                        product_name: source?.name,
                        position: source?.position,
                        product_price: source?.price?.raw?.withTax,
                        color: source?.variantGroupCode,
                        category: source?.classification?.mainCategoryName,
                        current_page: source?.currentPage,
                        header: source?.header,
                    },
                }),
            },
        },

        /**
         * Event: PDP Quick View Click
         */
        [AnalyticsEventType.SPECIFICATION_PRODUCT_DETAIL]: {
            transformMap: {
                event: AnalyticsEventType.SPECIFICATION_PRODUCT_DETAIL,
                category_selected: (source: any) => source?.mappedCategories?.length > 2 ? source?.mappedCategories?.[2]?.categoryName : EmptyString,
                header: (source: any) => source?.name,
                current_page: (source: any) => source?.currentPage,
            },
        },

        /**
         * Event: Begin Checkout
         */
        [AnalyticsEventType.BEGIN_CHECKOUT]: {
            transformMap: {
                originalLocation: (source: any) => `${source?.originalLocation}`,
                event: AnalyticsEventType.BEGIN_CHECKOUT,
                gtm: { uniqueEventId: GTMUniqueEventID.BEGIN_CHECKOUT, start: new Date().getTime() },
                crto: (source: any) => ({
                    email: "",
                    transactionid: "",
                    products: source?.cartItems?.lineItems?.length
                        ? source?.cartItems?.lineItems?.map((item: any, itemId: number) => ({
                            id: item?.sku,
                            price: item?.price?.raw?.withTax,
                            quantity: item?.qty,
                        }))
                        : new Array<any>()
                }),
                ecommerce: (source: any) => ({
                    items: source?.cartItems?.lineItems?.length
                        ? source?.cartItems?.lineItems?.map((item: any, itemId: number) => ({
                            item_id: item?.sku,
                            item_name: item?.name,
                            Affliation: "Fashion Store",
                            Coupon: "",
                            discount: source?.cartItems?.discount?.raw?.withTax,
                            index: itemId,
                            item_list_id: item?.id || item?.sku,
                            item_list_name: 'Cart',
                            item_variant: item?.colorName,
                            item_brand: item?.brand,
                            quantity: item?.qty,
                            item_is_bundle_item: source?.itemIsBundleItem,
                            price: item?.price?.raw?.withTax,
                            item_category: item?.categoryItems?.length ? item?.categoryItems[0]?.categoryName : EmptyString,
                        }))
                        : new Array<any>(),
                    current_page: source?.currentPage,
                    loggedin_status: source?.user?.userId && source?.user?.userId !== Guid.empty,
                    value: 'cartItems?.grandTotal?.raw?.withTax',
                }),
            },
        },

        /**
         * Event: Add Shipping Info
         */
        [AnalyticsEventType.ADD_SHIPPING_INFO]: {
            transformMap: {
                event: AnalyticsEventType.ADD_SHIPPING_INFO,
                ecommerce: (source: any) => ({
                    shipping_tier: source?.cartItems?.shippingMethods?.length ? source?.cartItems?.shippingMethods[0]?.countryCode : EmptyString,
                    coupon: source?.cartItems?.promotionsApplied?.length
                        ? source?.cartItems?.promotionsApplied?.map((x: any) => x?.promoCode)?.join(',')
                        : EmptyObject,
                    value: source?.cartItems?.subTotal?.raw?.withTax,
                    item_var_id: source?.cartItems?.id,
                    items: source?.cartItems?.length
                        ? source?.cartItems?.lineItems?.map((item: any) => ({
                            item_name: item?.name,
                            price: item?.price?.raw?.withTax,
                            quantity: item?.qty,
                            item_id: item?.id,
                            item_size: item?.variantProducts?.find((x: any) => x?.stockCode === item?.stockCode)?.variantAttributes?.find((x: any) => x?.fieldCode === 'clothing.size')?.fieldValue,
                            item_brand: item?.brand,
                            item_variant: item?.variantProducts?.find((x: any) => x?.stockCode === item?.stockCode)?.variantAttributes?.find((x: any) => x?.fieldCode === 'global.colour')?.fieldValue,
                        }))
                        : new Array<any>(),
                }),
            },
        },

        /**
         * Event: Add Payment Info
         */
        [AnalyticsEventType.ADD_PAYMENT_INFO]: {
            transformMap: {
                event: AnalyticsEventType.ADD_PAYMENT_INFO,
                gtm: { uniqueEventId: GTMUniqueEventID.ADD_PAYMENT_INFO, start: new Date().getTime(), },
                crto: (source: any) => ({
                    email: source?.user?.email,
                    transactionId: source?.transactionId,
                    products: source?.cartItems?.lineItems?.map((item: any, itemId: number) => ({
                        id: item?.sku,
                        price: item?.price?.raw?.withTax,
                        quantity: item?.qty,
                    })) || new Array<any>(),
                }),
                ecommerce: (source: any) => ({
                    items: source?.cartItems?.lineItems?.map(
                        (item: any, itemId: number) => ({
                            item_id: item?.stockCode,
                            item_name: item?.name,
                            Affliation: "FFX Website",
                            Coupon: "",
                            discount: "",
                            index: itemId,
                            item_list_name: item?.categoryItems?.length
                                ? item?.categoryItems[0]?.categoryName
                                : item?.classification?.category,
                            item_list_id: item?.categoryItems?.length
                                ? item?.categoryItems[0]?.categoryId
                                : item?.stockCode,
                            item_variant: item?.variantGroupCode || item?.colorName,
                            item_brand: item?.brand,
                            quantity: item?.qty,
                            item_is_bundle_item: false,
                            price: item?.price?.raw?.withTax,
                        })
                    ),
                    value: source?.cartItems?.grandTotal?.raw?.withTax,
                    currency: source?.cartItems?.baseCurrency,
                    payment_type: source?.paymentType.toUpperCase(),
                }),

            },
        },

        /**
         * Event: Purchase
         */
        [AnalyticsEventType.PURCHASE]: {
            transformMap: {
                originalLocation: (source: any) => `${source?.originalLocation}`,
                event: AnalyticsEventType.PURCHASE,
                gtm: { uniqueEventId: GTMUniqueEventID.PURCHASE, start: new Date().getTime() },
                crto: (source: any) => ({
                    email: source?.user?.email,
                    products: source?.cartItems?.lineItems?.length
                        ? source?.cartItems?.lineItems?.map((item: any, itemId: number) => ({
                            id: item?.sku,
                            price: item?.price?.raw?.withTax,
                            quantity: item?.qty,
                        }))
                        : new Array<any>(),
                }),
                ecommerce: (source: any) => ({
                    items: source?.cartItems?.lineItems?.length
                        ? source?.cartItems?.lineItems?.map(
                            (item: any, itemId: number) => ({
                                item_id: item?.stockCode,
                                item_name: item?.name,
                                Affliation: "Fashion Store",
                                Coupon: "",
                                discount: "",
                                index: itemId,
                                item_list_name: item?.categoryItems?.length ? item?.categoryItems[0]?.categoryName : item?.classification?.category,
                                item_list_id: item?.categoryItems?.length ? item?.categoryItems[0]?.categoryId : item?.stockCode,
                                item_variant: item?.variantGroupCode || item?.colorName,
                                item_brand: item?.brand,
                                quantity: item?.qty,
                                item_is_bundle_item: source?.itemIsBundleItem,
                                price: item?.price?.raw?.withTax,
                            })
                        )
                        : new Array<any>(),
                    value: source?.cartItems?.grandTotal?.raw?.withTax,
                    currency: source?.cartItems?.baseCurrency,
                    Purchase_Amount: source?.orderInfo?.order?.orderAmount,
                    Transaction_Id: getOrderId(source?.orderInfo?.order),
                    Cart_Amount: source?.cartItems?.grandTotal?.raw?.withTax || source?.orderInfo?.order?.orderAmount,
                }),
            },
        },

        /**
         * Event: Help Icon
         */
        [AnalyticsEventType.HELP_ICON]: {
            transformMap: {
                event: AnalyticsEventType.HELP_ICON,
                helpmode: (source: any) => source?.helpMode,
                device: (source: any) => source?.deviceCheck,
            },
        },

        /**
         * Event: Hamburger Menu
         */
        [AnalyticsEventType.HAMBURGER_MENU]: {
            transformMap: {
                event: AnalyticsEventType.HAMBURGER_MENU,
                current_page: (source: any) => source?.currentPage,
                device: (source: any) => source?.deviceCheck,
            },
        },

        /**
         * Event: Hamburger Menu click
         */
        [AnalyticsEventType.HAMBURGER_MENU_CLICK]: {
            transformMap: {
                event: AnalyticsEventType.HAMBURGER_MENU_CLICK,
                header: 'item',
                sub_header: (source: any) => source?.subHeader,
                sub_header2: (source: any) => source?.subHeader2,
                current_page: (source: any) => source?.currentPage,
                device: (source: any) => source?.deviceCheck,
            },
        },

        /**
         * Event: Hamburger Icon
         */
        [AnalyticsEventType.HAMBURGER_ICON_CLICK]: {
            transformMap: {
                event: AnalyticsEventType.HAMBURGER_ICON_CLICK,
                header: (source: any) => source?.header,
                sub_header: (source: any) => source?.subHeader,
                sub_header2: (source: any) => source?.subHeader2,
                current_page: (source: any) => source?.currentPage,
                device: (source: any) => source?.deviceCheck,
            },
        },

        /**
         * Event: Help Sidebar Menu
         */
        [AnalyticsEventType.HELP_SIDEBAR_MENU]: {
            transformMap: {
                event: AnalyticsEventType.HELP_SIDEBAR_MENU,
                helpmode: (source: any) => source?.mode,
                device: (source: any) => source?.deviceCheck,
            },
        },

        /**
         * Event: Need help with your order
         */
        [AnalyticsEventType.NEED_HELP_WITH_ORDER]: {
            transformMap: {
                event: AnalyticsEventType.NEED_HELP_WITH_ORDER,
                helpmode: 'Order',
                device: (source: any) => source?.deviceCheck,
            },
        },

        /**
         * Event: Proceed to cancel item
         */
        [AnalyticsEventType.PROCEED_TO_CANCEL_ITEM]: {
            transformMap: EmptyObject,
        },

        /**
         * Event: Proceed to cancel order
         */
        [AnalyticsEventType.PROCEED_TO_CANCEL_ORDER]: {
            transformMap: EmptyObject,
        },

        /**
         * Event: Proceed to return
         */
        [AnalyticsEventType.PROCEED_TO_RETURN]: {
            transformMap: EmptyObject,
        },

        /**
         * Event: Proceed to exchange
         */
        [AnalyticsEventType.PROCEED_TO_EXCHANGE]: {
            transformMap: EmptyObject,
        },

        /**
         * Event: Cancel Confirm
         */
        [AnalyticsEventType.CANCEL_CONFIRM]: {
            transformMap: {
                event: AnalyticsEventType.CANCEL_CONFIRM,
                transaction_id: (source: any) => source?.transactionId,
                user_id: (source: any) => source?.user?.userId,
                device: (source: any) => source?.deviceCheck,
            },
        },

        /**
         * Event: Return Confirm
         */
        [AnalyticsEventType.RETURN_CONFIRM]: {
            transformMap: {
                event: AnalyticsEventType.RETURN_CONFIRM,
                transaction_id: (source: any) => source?.transactionId,
                user_id: (source: any) => source?.user?.userId,
                device: (source: any) => source?.deviceCheck,
            },
        },

        /**
         * Event: Track Package
         */
        [AnalyticsEventType.TRACK_PACKAGE]: {
            transformMap: {
                event: AnalyticsEventType.TRACK_PACKAGE,
                transaction_id: (source: any) => source?.details?.payments?.id,
                device: (source: any) => source?.deviceCheck,
            },
        },

        /**
         * Event: Footer Query
         */
        [AnalyticsEventType.FOOTER_QUERY_CLICK]: {
            transformMap: {
                event: AnalyticsEventType.FOOTER_QUERY_CLICK,
                device: (source: any) => source?.deviceCheck,
                page_clicked_on: (source: any) => source?.currentPage,
                click_detail: (source: any) => source?.detail,
            },
        },

        /**
         * Event: Login Attempt
         */
        [AnalyticsEventType.LOGIN_ATTEMPT]: {
            transformMap: {
                event: AnalyticsEventType.LOGIN_ATTEMPT,
                device: (source: any) => source?.deviceCheck,
                browser: (source: any) => source?.browser,
                current_page: (source: any) => source?.currentPage,
            },
        },

        /**
         * Event: Notify Me
         */
        [AnalyticsEventType.NOTIFY_ME]: {
            transformMap: {
                event: AnalyticsEventType.NOTIFY_ME,
                current_page: (source: any) => source?.currentPage,
            },
        },

        /**
         * Event: Notify Click
         */
        [AnalyticsEventType.NOTIFY_CLICK]: {
            transformMap: {
                event: AnalyticsEventType.NOTIFY_CLICK,
                current_page: (source: any) => source?.currentPage,
            },
        },

        /**
         * Event: Referrer Banners
         */
        [AnalyticsEventType.REFERRER_BANNERS]: {
            transformMap: {
                event: AnalyticsEventType.REFERRER_BANNERS,
                cross_sell_category_position: (source: any) => source?.categoryPosition,
                section_title: (source: any) => source?.title,
                product_name: (source: any) => source?.name,
                product_clicked_position: (source: any) => source?.position,
                current_page: (source: any) => source?.currentPage,
            },
        },

        /**
         * Event: Logo Click
         */
        [AnalyticsEventType.LOGO_CLICK]: {
            transformMap: {
                event: AnalyticsEventType.LOGO_CLICK,
                current_page: (source: any) => source?.currentPage,
            },
        },

        /**
         * Event: Policy Popup
         */
        [AnalyticsEventType.POLICY_POPUP]: {
            transformMap: {
                event: AnalyticsEventType.POLICY_POPUP,
                current_page: (source: any) => source?.currentPage,
                category: (source: any) => source?.category,
            },
        },
    }
}