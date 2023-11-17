import SizeInline from '@components/product/ProductView/SizeInline'
import InlineList from '@components/product/ProductView/InlineList'
import Dropdown from '@components/product/ProductView/Dropdown'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import attributesGenerator, { getAttributesFromSlug, productLookup } from '@components/utils/attributesGenerator'
import { cloneDeep } from 'lodash'
const ATTR_COMPONENTS: any = {
  SizeInline: (props: any) => <SizeInline {...props} />,
  HorizontalList: (props: any) => <InlineList {...props} />,
  Dropdown: (props: any) => <Dropdown {...props} />,
}

export default function AttributesHandler({
  product,
  setSelectedAttrData,
  variant,
  variantInfo,
  handleSetProductVariantInfo,
  isQuickView = false,
  handleFetchProductQuickView,
  setVariantInfo,
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
    const componentKey = attribute?.fieldName == 'Colour' ?  attribute?.inputType == "" ? 'HorizontalList' : attribute?.inputType || 'HorizontalList' :
      attribute?.inputType == "" ? 'SizeInline' : attribute?.inputType || 'SizeInline';
    tempMap[attribute?.fieldCode] = ATTR_COMPONENTS[componentKey];
    return tempMap;
  }, {});

  const dynamicComponentMap = variantAttributes?.reduce((map: any, attribute: any) => {
    const componentKey = attribute?.fieldName == 'Colour' ? attribute?.inputType == "" ? 'HorizontalList' : attribute?.inputType || 'HorizontalList' :
      attribute?.inputType == "" ? 'SizeInline' : attribute?.inputType || 'SizeInline';
    map[attribute?.fieldCode] = ATTR_COMPONENTS[componentKey];
    return map;
  }, {});

  const [mapComponents, setMapComponents] = useState(dynamicComponentMap);

  const initialFieldData = variantAttributes?.reduce((data: any, attribute: any) => {
    data[attribute?.fieldCode] = '';
    return data;
  }, {});

  const [fieldData, setFieldData] = useState(initialFieldData);


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
  const slug = productSlug || `products/${router.query.slug}`
  const originalAttributes = getAttributesFromSlug(slug, variantProducts) || {}
  const generatedAttrCombination = Object?.fromEntries(Object?.entries(originalAttributes))
  const [attrCombination, setAttrCombination] = useState(generatedAttrCombination)

  useEffect(() => {
    const updatedFieldData = { ...fieldData };

    variantAttributes?.forEach((attribute: any) => {
      const { fieldCode } = attribute;
      const variantValue = variantInfo[fieldCode];

      if (variantValue !== undefined) {
        updatedFieldData[fieldCode] = variantValue;
      }
    });

    setFieldData(updatedFieldData);
  }, [variantInfo, variantAttributes]);


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

  const handleChange = (fieldCode: string, value: string, fieldSet: any) => {
    const updatedFieldData = {
      ...fieldData,
      [fieldCode]: value,
    };

    // for quickview
    const constructQuickViewParameters = (fieldData: any, fieldSet: any) => {
      const parameters: any = {
        slug: fieldSet?.slug || null,
        fieldSet,
      };

      Object?.keys(fieldData)?.forEach((fieldCode) => {
        parameters[fieldCode] = fieldData[fieldCode];
      });

      return parameters;
    };

    if (isQuickView) {
      const quickViewParameters = constructQuickViewParameters(updatedFieldData, fieldSet);
      handleFetchProductQuickView(quickViewParameters);
      return;
    }

    if (fieldSet?.slug) {
      router.push(`/${fieldSet?.slug}`)
    }
    setFieldData(updatedFieldData);
  }

  const handleChangeOld = (fieldCode: string, value: string, fieldSet: any) => {
    const updatedFieldData = {
      ...fieldData,
      [fieldCode]: value,
    };
    setFieldData(updatedFieldData);
    const slug = generateLink(updatedFieldData);
    const constructParameters = (fieldData: any, fieldSet: any) => {
      const parameters: any = {
        slug,
        fieldSet,
      };

      Object?.keys(fieldData)?.forEach((fieldCode) => {
        parameters[fieldCode] = fieldData[fieldCode];
      });

      return parameters;
    };

    if (slug) {
      if (isQuickView) {
        const parameters = constructParameters(updatedFieldData, fieldSet);
        handleFetchProductQuickView(parameters);
      } else {
        const parameters = constructParameters(updatedFieldData, fieldSet);
        router.push(`/${slug}`);
      }
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
    variantProducts?.find((product: any) => {
      product?.attributes?.forEach((attr: any) => {
        if (
          key?.toLowerCase() === attr?.fieldCode?.toLowerCase() &&
          attr?.fieldValue === variant
          // product.slug === slug
        ) {
          productData.stock = product?.currentStock
          productData = { ...productData, ...product }
        }
      })
    })
    return productData
  }
  const isCustomAttr = product?.variantAttributes?.length > 2
  const generateOptions = (option: any) => {
    const isInOrder = Object?.keys(originalAttributes)?.findIndex((i: string) => i === option?.fieldCode) - Object?.keys(attrCombination)?.length === 0 || Object?.keys(attrCombination)?.includes(option?.fieldCode)
    const isLastItem = Object?.keys(attrCombination).pop() === option?.fieldCode
    if (isInOrder) {
      if (
        isCustomAttr &&
        Object?.keys(attrCombination)?.length > 1 &&
        !isLastItem
      ) {
        const entriesFromCombination = () => {
          return Object?.fromEntries(Object?.entries(attrCombination)?.slice(-1))
        }
        const generatedAttributes = attributesGenerator(
          entriesFromCombination(),
          variantProducts
        )
        return generatedAttributes?.map((item: any) => {
          if (option?.fieldCode === item?.fieldCode) {
            return item
          }
        }).filter((el) => el)
      } else return option?.fieldValues
    } else return []
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
    const dynamicAttributes = variantAttributes?.map((attribute: any, index: number) => ({
      ...attribute,
      displayOrder: index + 1,
    }));

    return dynamicAttributes;
  };

  const DefaultComponent: any = () => null;
  const stateAttributes: any = attrCombination;
  const dynamicAttributes = generateDynamicAttributes();
  const keyAttributes = dynamicAttributes?.map((attribute: any) => attribute?.fieldCode);

  const matchAttributes =
    variantAttributes && variantAttributes?.length
      ? variantAttributes?.filter((x: any) => keyAttributes?.includes(x?.fieldCode))
      : false;

  const sortAttributes =
    matchAttributes && matchAttributes?.length === keyAttributes?.length;

  const tempVariantAttrs = variantAttributes?.map((x: any, index: number) => ({
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
        const Component = ATTR_COMPONENTS[option?.inputType] || mapComponents[option?.fieldCode] || DefaultComponent
        return (
          <div key={`attribute-handler-${optionIdx}`}>
            <Component
              currentAttribute={originalAttribute}
              getStockPerAttribute={getStockPerAttribute}
              items={optionsToPass}
              label={option?.fieldName}
              isDisabled={!optionsToPass.length}
              onChange={handleChange}
              setSelectedAttrData={handleSelectedAttrData}
              fieldCode={option?.fieldCode}
              productId={product?.id}
              setAttrCombination={handleAttrCombinations}
              generateLink={generateLink}
              product={product}
              variant={variant}
              handleSetProductVariantInfo={handleSetProductVariantInfo}
              sizeInit={sizeInit}
              setSizeInit={setSizeInit}
            />
          </div>
        )
      })}
    </>
  )
}