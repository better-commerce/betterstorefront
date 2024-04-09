"use client";

import { Popover } from "@headlessui/react";
import { useState } from "react";
import Link from "next/link";
import { getCurrentPage } from "@framework/utils/app-util";
import { recordGA4Event } from "@components/services/analytics/ga4";
import { useUI } from "@components/ui";
import { useTranslation } from '@commerce/utils/use-translation'

export default function CartDropdown() {
  const { cartItems, openCart } = useUI()
  const translate = useTranslation()
  let currentPage = getCurrentPage()
  function viewCart(cartItems: any) {
    if (currentPage) {
      if (typeof window !== 'undefined') {
        recordGA4Event(window, 'view_cart', {
          ecommerce: {
            items: cartItems?.lineItems?.map((items: any, itemId: number) => ({
              item_name: items?.name,
              item_id: items?.sku,
              price: items?.price?.raw?.withTax,
              item_brand: items?.brand,
              item_category2: items?.categoryItems?.length ? items?.categoryItems[1]?.categoryName : '',
              item_variant: items?.colorName,
              item_list_name: items?.categoryItems?.length ? items?.categoryItems[0]?.categoryName : '',
              item_list_id: '',
              index: itemId,
              quantity: items?.qty,
              item_var_id: items?.stockCode,
            })),
            current_page: currentPage,
          },
        })
      }
    }
  }

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button onClick={() => { viewCart(cartItems); openCart() }} className={` ${open ? "" : "text-opacity-90"} group w-10 h-10 sm:w-12 sm:h-12 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 relative`}>
            {cartItems?.lineItems?.length > 0 && (
              <div className="w-3.5 h-3.5 flex items-center justify-center bg-primary-500 absolute top-1.5 right-1.5 rounded-full text-[10px] leading-none text-white font-medium">
                {cartItems?.lineItems?.length}
              </div>
            )}
            <span className="sr-only">{translate('label.basket.itemsCartViewBagText')}</span>
            <img src="/images/cartIcon.svg" className="w-6 h-6"/>          
          </Popover.Button>
        </>
      )}
    </Popover >
  );
}
