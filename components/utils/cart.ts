/**
 * Use to group cart items by their
 * basket group ID and product ID
 * @param data
 */
export const groupCartItemsById = (data: any) => {
  return (
    data?.reduce((acc: any, cur: any) => {
      if (!cur.basketItemGroupId) acc[cur.id] = { ...cur }
      if (cur.basketItemGroupId) {
        if (!acc[cur.basketItemGroupId]) acc[cur.basketItemGroupId] = []
        acc[cur.basketItemGroupId].push(cur)
      }
      return acc
    }, {}) || {}
  )
}

/**
 * Use to group order items by their
 * order group ID and its ID
 * @param data
 */
export const groupOrderItemsById = (data: any) => {
  return (
    data?.reduce((acc: any, cur: any) => {
      if (!cur.orderItemGroupId)
        acc[`${cur.id}-${cur.statusDisplay}`] = { ...cur }
      if (cur.orderItemGroupId) {
        if (!acc[cur.orderItemGroupId]) acc[cur.orderItemGroupId] = []
        acc[cur.orderItemGroupId].push(cur)
      }
      return acc
    }, {}) || {}
  )
}

/**
 * Use to group split delivery order items by their
 * order group ID and product ID
 * @param data
 */
export const splitDeliveryGroupOrderItemsById = (data: any) => {
  let output: any = {}
  for (let i in data) {
    const itemsArr = data[i]
    const groupedItems: any = {}
    itemsArr?.forEach((o: any) => {
      if (o?.product?.orderItemGroupId) {
        if (!groupedItems[o?.product?.orderItemGroupId]) groupedItems[o?.product?.orderItemGroupId] = []
        groupedItems[o?.product?.orderItemGroupId] = [
          ...groupedItems[o?.product?.orderItemGroupId],
          o
        ]
      } else {
        if (!output[i]) output[i] = []
        output[i] = [
          ...output[i],
          o
        ]
      }
    })
    if (output?.[i]) {
      output[i] = [
        ...output[i],
        ...Object.values(groupedItems)
      ]
    } else {
      output[i] = [
        ...Object.values(groupedItems)
      ]
    }
    output[i] = output?.[i]?.flat()
  }
  return output
}
