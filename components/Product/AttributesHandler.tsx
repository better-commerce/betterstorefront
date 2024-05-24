import { useRouter } from 'next/router'
import { useState, useEffect, useMemo } from 'react'
import cloneDeep from 'lodash/cloneDeep'
import axios from 'axios'

//
import { NEXT_GET_PRODUCT } from '@components/utils/constants'
import attributesGenerator, { getAttributesFromSlug, productLookup } from '@components/utils/attributesGenerator'
import SizeInline from './SizeInline'
import InlineList from './InlineList'
import { matchStrings } from '@framework/utils/parse-util'

const ATTR_COMPONENTS: any = {
  SizeInline: (props: any) => <SizeInline {...props} />,
  HorizontalList: (props: any) => <InlineList {...props} />,
  Dropdown: (props: any) => <SizeInline {...props} />, // Used SizeInline Component because FFX used inline design we can use <Dropdown {...props} /> if we can
}

export default function AttributesHandler({
  product,
  setSelectedAttrData,
  variant,
  variantInfo,
  handleSetProductVariantInfo,
  isQuickView = false,
  handleFetchProductQuickView = () => { },
  componentAttributeKey = '',
  sizeInit,
  setSizeInit,
}: any) {
  const {
    attributes,
    variantAttributes = [],
    variantProducts,
    slug: productSlug,
  } = product

  const TEMP_MAP = variantAttributes?.reduce((tempMap: any, attribute: any) => {
    const componentKey = attribute?.fieldName == 'Colour' ?
      attribute?.inputType == "" ? 'HorizontalList' : attribute?.inputType || 'HorizontalList' :
      attribute?.inputType == "" ? 'SizeInline' : attribute?.inputType || 'SizeInline';
    tempMap[attribute?.fieldCode] = ATTR_COMPONENTS[componentKey];
    return tempMap;
  }, {});

  const dynamicComponentMap = variantAttributes?.reduce((map: any, attribute: any) => {
    const componentKey = attribute?.fieldName == 'Colour' ?
      attribute?.inputType == "" ? 'HorizontalList' : attribute?.inputType || 'HorizontalList' :
      attribute?.inputType == "" ? 'SizeInline' : attribute?.inputType || 'SizeInline';
    map[attribute?.fieldCode] = ATTR_COMPONENTS[componentKey];
    return map;
  }, {});

  const [mapComponents, setMapComponents] = useState(dynamicComponentMap);

  const [fieldData, setFieldData] = useState({});


  useEffect(() => {
    if (!!componentAttributeKey?.length) {
      setMapComponents({
        [componentAttributeKey]: TEMP_MAP[componentAttributeKey],
      })
    } else {
      setMapComponents(TEMP_MAP)
    }
  }, [componentAttributeKey])

  const router = useRouter()

  const slug = useMemo(() => productSlug || variant?.slug || variant?.link || `products/${router.query?.slug}`, [productSlug, variant?.slug, variant?.link, router.query?.slug])
  const originalAttributes = useMemo(() => getAttributesFromSlug(slug, variantProducts) || {}, [slug, variantProducts])
  const [attrCombination, setAttrCombination] = useState<any>({})

  useEffect(() => {
    const updatedAttrCombination = getAttributesFromSlug(slug, product?.variantProducts) || {}
    setAttrCombination(updatedAttrCombination)
  }, [slug, product?.variantProducts])

  useEffect(() => {
    const initialFieldData = product?.variantAttributes?.reduce((data: any, attribute: any) => {
      data[attribute?.fieldCode] = '';
      return data;
    }, {});
    const updatedFieldData = { ...(initialFieldData || {}) };
    product?.variantAttributes?.forEach((attribute: any) => {
      const { fieldCode } = attribute;
      const variantValue = variantInfo[fieldCode];

      if (variantValue !== undefined) {
        updatedFieldData[fieldCode] = variantValue;
      }
    });

    setFieldData(updatedFieldData);
  }, [variantInfo, product?.variantAttributes]);


  const generateLink = (fieldData: any) => {
    let slug = ''
    for (let i = 0; i < variantProducts?.length; i++) {
      const attributes = variantProducts[i]?.attributes
      const isFound = attributes?.every(
        (attribute: any) =>
          fieldData[attribute?.fieldCode] &&
          fieldData[attribute?.fieldCode] === attribute?.fieldValue
      )
      if (isFound) {
        slug = variantProducts[i]?.slug
        break
      }
    }
    return slug
  }

  const getProduct = async (slug: string) => {
    const { data: productData }: any = await axios.post(NEXT_GET_PRODUCT, { slug: slug })
    return productData
  }

  const handleChange = (fieldCode: string, value: string, fieldSet: any) => {
    const updatedFieldData = {
      ...fieldData,
      [fieldCode]: value,
    };

    // for quick view product
    if (isQuickView) {
      handleFetchProductQuickView(fieldSet?.slug);
    }

    // for PDP, page should get refreshed if slug exist
    if (fieldSet?.slug && !isQuickView) {
      router.push(`/${fieldSet?.slug}`, undefined, { scroll: false })
    }

    setFieldData(updatedFieldData);
  }
  const getStockPerAttribute = (key: string, variant: string) => {
    let productData = {
      stock: 0,
      productId: '',
      isPreOrderEnabled: false,
      sellWithoutInventory: false,
      stockCode: '',
    }
    const slug = `products/${router.query.slug}`
    variantProducts?.find((product: any) => {
      product?.attributes?.forEach((attr: any) => {
        if (matchStrings(key, attr?.fieldCode, true) && matchStrings(attr?.fieldValue, variant) && matchStrings(product?.slug, slug)) {
          productData.stock = product?.currentStock
          productData = { ...productData, ...product }
        }
      })
    })
    return productData
  }
  const isCustomAttr = false //product?.variantAttributes?.length > 2

  const generateOptions = (option: { fieldCode: string, fieldValues: any[] }) => {
    const originalKeys = Object.keys(originalAttributes)
    const combinationKeys: any = Object.keys(attrCombination)
    const isInOrder = originalKeys?.findIndex(key => key === option?.fieldCode) - combinationKeys?.length === 0 || combinationKeys?.includes(option?.fieldCode)
    const isLastItem = combinationKeys?.at(-1) === option?.fieldCode
    if (!isInOrder) return []
    if (isCustomAttr && combinationKeys?.length > 1 && !isLastItem) {
      const lastEntry = Object.fromEntries([combinationKeys?.map((key: any) => [key, attrCombination?.[key]]).at(-1)])
      const generatedAttributes = attributesGenerator(lastEntry, variantProducts)
      return generatedAttributes.filter((item: any) => item?.fieldCode === option?.fieldCode)
    }
    return option?.fieldValues
  }

  const handleAttrCombinations = (key: string, value: any) => {
    setAttrCombination((prevValue: any) => {
      let newValue = prevValue
      const existingValueIndex = Object?.keys(prevValue)?.findIndex((i: any) => i === key)
      newValue[key] = value
      if (existingValueIndex > -1) {
        newValue = Object?.fromEntries(Object?.entries(newValue))
        return newValue
      }
      newValue = { ...newValue, [key]: value }
      return newValue
    })
  }

  const handleSelectedAttrData = (value: any) => {
    if (isCustomAttr) {
      if (Object?.keys(attrCombination)?.length === Object?.keys(originalAttributes)?.length) {
        const currentProduct = productLookup(variantProducts, attrCombination)[0]
        if (currentProduct) setSelectedAttrData(currentProduct)
      }
    } else setSelectedAttrData(value)
  }

  const generateDynamicAttributes = () => {
    const dynamicAttributes = variantAttributes?.map(
      (attribute: any, index: number) => ({
        ...attribute,
        displayOrder: index + 1,
      })
    ) || []
    if (variantProducts?.length > 0) {
      for (let i = 1; i < dynamicAttributes?.length; i++) {
        const variantAttrib = dynamicAttributes[i]
        const attribValues: any = []
        for (let j = 0; j < variantProducts?.length; j++) {
          const variantProd = variantProducts[j]
          attribValues.push(
            variantProd?.attributes?.find(
              (o: any) => o.fieldCode === variantAttrib.fieldCode
            )
          )
        }
        variantAttrib.fieldValues = variantAttrib.fieldValues.filter(
          (field: any) =>
            attribValues.some((o: any) => o?.fieldValue === field?.fieldValue)
        )
      }
    }
    return dynamicAttributes
  }

  const DefaultComponent: any = () => null;
  const stateAttributes: any = attrCombination;
  const dynamicAttributes = generateDynamicAttributes();
  const keyAttributes = dynamicAttributes?.map((attribute: any) => attribute?.fieldCode);

  const matchAttributes =
    dynamicAttributes && dynamicAttributes?.length
      ? dynamicAttributes?.filter((x: any) => keyAttributes?.includes(x?.fieldCode))
      : false;

  const sortAttributes =
    matchAttributes && matchAttributes?.length === keyAttributes?.length;

  const tempVariantAttrs = dynamicAttributes?.map((x: any, index: number) => ({
    ...x,
    ...{ displayOrder: index + 1 },
  }));

  const newVariantAttrs = sortAttributes
    ? cloneDeep(tempVariantAttrs)?.map((x: any, index: number) => {
      const { fieldCode } = x;
      const displayOrder = tempVariantAttrs?.find((attr: any) => attr?.fieldCode === fieldCode)
        ?.displayOrder;

      if (keyAttributes.includes(fieldCode)) {
        x.displayOrder = displayOrder;
      }

      return x;
    })
    : tempVariantAttrs;


  return (
    <>
      {newVariantAttrs?.sort((first: any, second: any) => {
        return first.displayOrder - second?.displayOrder
      })?.map((option: any, optionIdx: number) => {
        const optionsToPass = generateOptions(option)
        const originalAttribute = isCustomAttr ? stateAttributes[option?.fieldCode] : originalAttributes[option?.fieldCode]
        const Component = ATTR_COMPONENTS[(option?.fieldName == "Colour" || option?.fieldName == "Color") ? "HorizontalList" : "SizeInline"] || mapComponents[option?.fieldCode] || DefaultComponent
        return (
          <div key={`attribute-handler-${optionIdx}`}>
            <Component
              componentIdx={optionIdx}
              isQuickView={isQuickView}
              currentAttribute={originalAttribute}
              getStockPerAttribute={getStockPerAttribute}
              items={optionsToPass}
              label={option?.fieldName}
              isDisabled={!optionsToPass.length}
              onChange={handleChange}
              setSelectedAttrData={setSelectedAttrData}
              fieldCode={option?.fieldCode}
              productId={product?.id}
              setAttrCombination={handleAttrCombinations}
              generateLink={generateLink}
              product={product}
              variant={variant}
              handleSetProductVariantInfo={handleSetProductVariantInfo}
              sizeInit={sizeInit}
              setSizeInit={setSizeInit}
              isLastComponentIdx={optionIdx === newVariantAttrs?.length - 1}
            />
          </div>
        )
      })}
    </>
  )
}