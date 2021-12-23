import Dropdown from './Dropdown'
import InlineList from './InlineList'
import { useRouter } from 'next/router'
import { useState } from 'react'
import attributesGenerator from '@components/utils/attributesGenerator'

const ATTR_COMPONENTS: any = {
  Dropdown: (props: any) => <Dropdown {...props} />,
  HorizontalList: (props: any) => <InlineList {...props} />,
  undefined: () => null,
}

const TEMP_MAP: any = {
  'clothing.size': ATTR_COMPONENTS['Dropdown'],
  'global.colour': ATTR_COMPONENTS['HorizontalList'],
}

export default function AttributesHandler({
  product,
  setSelectedAttrData,
}: any) {
  const { attributes, variantProductsAttribute = [], variantProducts } = product

  const router = useRouter()

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

  const generatedAttrCombination = Object.fromEntries(
    Object.entries(originalAttributes).slice(0, 1)
  )
  const [attrCombination, setAttrCombination] = useState(
    generatedAttrCombination
  )

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

  const getStockPerAttribute = (key: string, variant: string) => {
    let productData = {
      stock: 0,
      productId: '',
      isPreOrderEnabled: false,
      sellWithoutInventory: false,
      stockCode: '',
    }
    // const slug = `products/${router.query.slug}`
    variantProducts.find((product: any) => {
      product.variantAttributes.forEach((attr: any) => {
        if (
          key.toLowerCase() === attr.fieldCode.toLowerCase() &&
          attr.fieldValue === variant
          // product.slug === slug
        ) {
          productData.stock = product.currentStock
          productData = { ...productData, ...product }
        }
      })
    })
    return productData
  }

  const isCustomAttr = product.stockCode === '123N'

  const generateOptions = (option: any) => {
    const isInOrder =
      Object.keys(originalAttributes).findIndex(
        (i: string) => i === option.fieldCode
      ) -
        Object.keys(attrCombination).length ===
        0 || Object.keys(attrCombination).includes(option.fieldCode)

    const isLastItem = Object.keys(attrCombination).pop() === option.fieldCode
    if (isInOrder) {
      if (
        isCustomAttr &&
        Object.keys(attrCombination).length > 1 &&
        !isLastItem
      ) {
        const entriesFromCombination = () => {
          return Object.fromEntries(
            Object.entries(attrCombination).slice(
              1,
              Object.keys(attrCombination).length
            )
          )
        }
        const generatedAttributes = attributesGenerator(
          entriesFromCombination(),
          variantProducts
        )
        return generatedAttributes
          .map((item: any) => {
            if (option.fieldCode === item.fieldCode) {
              return item
            }
          })
          .filter((el) => el)
      } else return option.fieldValues
    } else return []
  }

  const handleAttrCombinations = (key: string, value: any) => {
    setAttrCombination((prevValue: any) => {
      let newValue = prevValue
      const existingValueIndex = Object.keys(prevValue).findIndex(
        (i: any) => i === key
      )
      newValue[key] = value
      if (existingValueIndex > -1) {
        newValue = Object.fromEntries(
          Object.entries(newValue).slice(0, existingValueIndex + 1)
        )
      }
      return newValue
    })
  }

  const handleSelectedAttrData = (value: any) => {
    if (isCustomAttr) {
      if (
        Object.keys(attrCombination).length ===
        Object.keys(originalAttributes).length
      ) {
        setSelectedAttrData(value)
      }
    } else setSelectedAttrData(value)
  }

  const DefaultComponent: any = () => null
  const stateAttributes: any = attrCombination
  return (
    <>
      {variantProductsAttribute?.map((option: any, idx: number) => {
        const optionsToPass = generateOptions(option)
        const originalAttribute = isCustomAttr
          ? stateAttributes[option.fieldCode]
          : originalAttributes[option.fieldCode]
        const Component =
          ATTR_COMPONENTS[option.inputType] ||
          TEMP_MAP[option.fieldCode] ||
          DefaultComponent
        return (
          <div key={idx} className="py-3">
            <Component
              currentAttribute={originalAttribute}
              getStockPerAttribute={getStockPerAttribute}
              items={optionsToPass}
              label={option.fieldName}
              isDisabled={!optionsToPass.length}
              onChange={handleChange}
              setSelectedAttrData={handleSelectedAttrData}
              fieldCode={option.fieldCode}
              productId={product.id}
              setAttrCombination={handleAttrCombinations}
              generateLink={generateLink}
            />
          </div>
        )
      })}
    </>
  )
}
