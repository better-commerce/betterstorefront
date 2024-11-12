import Cookies from 'js-cookie'

//
import { BASKET_TYPES, Cookie } from '@framework/utils/constants'
import {
  cartItemsValidateAddToCart,
  getCurrentPage,
} from '@framework/utils/app-util'
import {
  GTMUniqueEventID,
} from '@components/services/analytics/ga4'
import {
  EmptyGuid,
  EmptyObject,
  EmptyString,
  Messages,
  SITE_ORIGIN_URL,
} from '@components/utils/constants'
import { AlertType } from '@framework/utils/enums'
import useCart from '@components/services/cart'
import { matchStrings, tryParseJson } from '@framework/utils/parse-util'
import { kitBasketId } from '@components/ui/context'

const CART_ACTION_TYPES = {
  INCREASE: 'increase',
  DECREASE: 'decrease',
  DELETE: 'delete',
}

/**
 * @param product - current product
 * @param cartItems - list of the products in cart
 * @param action - cart actions such as increase, decrease, or delete
 * @param options - other options
 */
export const cartItemQtyHandler = async (
  product: any,
  cartItems: any,
  action: any,
  options?: any,
  callback = (err?: any, data?: any) => {}
) => {
  const currentPage = getCurrentPage()
  const { addToCart } = useCart()
  const { maxBasketItemsCount, basketName = BASKET_TYPES.DEFAULT } = options

  async function updateBasket(product: any) {
    let {
      categoryItems = [],
      productId,
      name,
      stockCode,
      displayOrder = 0,
      currentStock,
      basketItemGroupData = undefined,
      basketItemGroupId = undefined,
      sku,
      colorName,
      brand,
      qty: productQty,
      price,
      recordId,
      selectQty = 0,
    } = product || EmptyObject
    let {
      id: basketId = EmptyGuid,
      lineItems,
      grandTotal,
    } = cartItems || EmptyObject
    productId = productId || recordId

    // set basketId if not found
    if (basketId === EmptyGuid) basketId = Cookies.get(Cookie.Key.BASKET_ID)

    if (basketName === BASKET_TYPES.KIT) {
      basketId = kitBasketId()
      basketItemGroupId = basketId
    }

    // request payload
    const payload: any = {
      basketId,
      basketName,
      productId,
      name,
      stockCode,
      displayOrder,
      qty: undefined,
    }

    if (basketItemGroupData) payload.basketItemGroupData = basketItemGroupData
    if (basketItemGroupId) payload.basketItemGroupId = basketItemGroupId

    switch (action) {
      case CART_ACTION_TYPES.INCREASE:
        payload.qty = 1

        if (selectQty >= 1 && productQty >= 0 && selectQty !== productQty) {
          payload.qty = selectQty - productQty
        }

        if (basketItemGroupData?.kitQty >= 1) {
          payload.qty = payload.qty * basketItemGroupData?.kitQty
        }

        const foundLineItem = lineItems?.find((o: any) =>
          matchStrings(o?.productId, productId, true)
        )
        if (foundLineItem?.qty >= currentStock && !tryParseJson(foundLineItem?.attributesJson)?.FulfilFromSupplier && !tryParseJson(foundLineItem?.attributesJson)?.SellWithoutInventory) {
          return callback({
            type: AlertType.ERROR,
            msg: Messages.Errors['CART_ITEM_QTY_MAX_ADDED'],
          })
        }

        const canUpdateBasket = cartItemsValidateAddToCart(
          cartItems,
          maxBasketItemsCount
        )
        if (!canUpdateBasket) {
          return callback({
            type: AlertType.ERROR,
            msg: Messages.Errors['CART_ITEM_QTY_LIMIT_EXCEEDED'],
          })
        }
        break
      case CART_ACTION_TYPES.DECREASE:
      case CART_ACTION_TYPES.DELETE:
        payload.qty = action === CART_ACTION_TYPES.DECREASE ? -1 : 0
        if (basketItemGroupData?.kitQty >= 1) {
          payload.qty = payload.qty * basketItemGroupData?.kitQty
        }       
        break
    }

    try {
      const item = await addToCart(payload, action, { product })
      return callback(null, item)
    } catch (error) {
      return callback(Messages.Errors['GENERIC_ERROR'])
    }
  }

  if(product?.length > 1){
    product?.forEach((item:any) => {
      updateBasket(item)
    });
  }
  else{
    updateBasket(product)
  }
}
