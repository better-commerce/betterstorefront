let checker = (arr: any, target: any) =>
  target.every((v: any) => arr.includes(v))

export default function attributesGenerator(
  combination: any,
  variantProducts: []
) {
  return Object.entries(combination)
    .reduce((acc, obj) => {
      variantProducts.forEach((el: any) => {
        const fieldValues: any = []
        el.variantAttributes.some((item: any) => {
          fieldValues.push(item.fieldValue)
        })

        if (checker(fieldValues, Object.values(combination))) {
          acc = acc.concat(el.variantAttributes)
          return acc
        }
      })
      return acc
    }, [])
    .filter(
      (value: any, index: number, self: any) =>
        index ===
        self.findIndex(
          (t: any) =>
            t.fieldValue === value.fieldValue && t.fieldCode === value.fieldCode
        )
    )
}

export const getAttributesFromSlug = (slug: string, variantProducts: any) => {
  return variantProducts.reduce((acc: any, obj: any) => {
    if (obj.slug === slug) {
      obj.variantAttributes.forEach((varAttr: any) => {
        acc[varAttr.fieldCode] = varAttr.fieldValue
      })
    }
    return acc
  }, {})
}

export const getProductFromAttributes = (
  fieldCode: string,
  value: string,
  variant: any,
  variantProducts: any,
  slug: string = ''
) => {
  const normalizer = variant.variant
    ? {
        variantAttributes: Object.entries(
          getAttributesFromSlug(slug, variantProducts)
        ).map(([key, value]: any) => {
          return { fieldCode: key, fieldValue: value }
        }),
      }
    : variant

  const existingCombination = normalizer.variantAttributes.map((i: any) => {
    if (i.fieldCode === fieldCode) {
      return value
    } else return i.fieldValue
  })
  const variantLookUp = variantProducts.filter((product: any) => {
    let combination = product.variantAttributes.map((i: any) => i.fieldValue)
    return checker(existingCombination, combination)
  })[0]
  return variantLookUp || variant
}
