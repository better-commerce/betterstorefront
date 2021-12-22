export default function attributesGenerator(
  combination: any,
  variantProducts: []
) {
  let checker = (arr: any, target: any) =>
    target.every((v: any) => arr.includes(v))
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
