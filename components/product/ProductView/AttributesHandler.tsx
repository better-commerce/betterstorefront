import Dropdown from './Dropdown'
import InlineList from './InlineList'
import { useRouter } from 'next/router'

const ATTR_COMPONENTS: any = {
  Dropdown: (props: any) => <Dropdown {...props} />,
  HorizontalList: (props: any) => <InlineList {...props} />,
  undefined: () => null,
}

export default function AttributesHandler({ product }: any) {
  const { attributes, variantProductsAttribute = [], variantProducts } = product

  const router = useRouter()

  const generateLink = (fieldCode: any, value: any) => {
    let slug = ''
    variantProducts.find((item: any) => {
      item.variantAttributes.find((option: any) => {
        const isFieldCode = option.fieldCode === fieldCode
        const isFieldValue = option.fieldValue === value
        if (isFieldCode && isFieldValue) {
          slug = item.slug
        }
      })
    })
    return slug
  }

  const handleChange = (fieldCode: string, value: string) => {
    const slug = generateLink(fieldCode, value)
    if (slug) {
      router.push(`/${slug}`)
    }
  }

  const getAttributesFromSlug = () => {
    const slug = `products/${router.query.slug}`
    return variantProducts.reduce((acc: any, obj: any) => {
      if (obj.slug === slug) {
        obj.variantAttributes.forEach((varAttr: any) => {
          acc[varAttr.fieldCode] = varAttr.fieldValue
        })
      }
      return acc
    }, {})
  }

  const originalAttributes = getAttributesFromSlug()

  const DefaultComponent: any = () => null

  return (
    <>
      {variantProductsAttribute?.map((option: any, idx: number) => {
        const Component = ATTR_COMPONENTS[option.inputType] || DefaultComponent
        return (
          <div key={idx} className="py-3">
            <Component
              currentAttribute={originalAttributes[option.fieldCode]}
              items={option.fieldValues}
              label={option.fieldName}
              onChange={handleChange}
              fieldCode={option.fieldCode}
            />
          </div>
        )
      })}
    </>
  )
}
