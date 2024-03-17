import { useTranslation } from '@commerce/utils/use-translation'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { vatIncluded } from '@framework/utils/app-util'
import { tryParseJson } from '@framework/utils/parse-util'

const BasketItems = ({ userCartItems }: any) => {
  const translate = useTranslation()
  const isIncludeVAT = vatIncluded()
  return (
    <>
      {userCartItems?.map((product: any, index: number) => {
        const voltageAttr: any = tryParseJson(product?.attributesJson)
        const electricVoltAttrLength = voltageAttr?.Attributes?.filter(
          (x: any) => x?.FieldCode == 'electrical.voltage'
        )
        let productNameWithVoltageAttr: any = product?.name
        productNameWithVoltageAttr =
          electricVoltAttrLength?.length > 0
            ? electricVoltAttrLength?.map((volt: any, vId: number) => (
                <span key={`voltage-${vId}`}>
                  {product?.name?.toLowerCase()}{' '}
                  <span className="p-0.5 text-xs font-bold text-black bg-white border border-gray-500 rounded">
                    {volt?.ValueText}
                  </span>
                </span>
              ))
            : (productNameWithVoltageAttr = product?.name)

        return (
          <div
            key={product?.id}
            className={`w-full px-2 py-2 mb-2 border rounded items-list ${
              product?.price?.raw?.withTax > 0
                ? 'bg-white'
                : 'bg-emerald-50 border-emerald-400'
            }`}
          >
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-3 img-container">
                <img
                  width={120}
                  height={150}
                  src={`${product?.image}` || IMG_PLACEHOLDER}
                  alt={product?.name}
                  className="object-cover object-center w-32 image"
                />
              </div>
              <div className="col-span-9">
                <h6 className="font-light text-black">
                  {productNameWithVoltageAttr}
                </h6>
                <div className="flex items-center justify-between w-full my-2 gap-y-3">
                  <div className="justify-start text-left">
                    {product?.price?.raw?.withTax > 0 ? (
                      <>
                        <span className="block font-semibold text-black font-14">
                          {isIncludeVAT
                            ? product?.price?.formatted?.withTax
                            : product?.price?.formatted?.withoutTax}
                          {product?.listPrice?.raw.withTax > 0 &&
                          product?.listPrice?.raw.withTax !=
                            product?.price?.raw?.withTax ? (
                            <span className="pl-2 font-normal text-gray-400 line-through font-14">
                              {' '}
                              {isIncludeVAT
                                ? product?.listPrice.formatted?.withTax
                                : product?.listPrice.formatted?.withoutTax}
                            </span>
                          ) : null}
                          <span className="pl-2 font-light text-black font-12">
                            {isIncludeVAT ? translate('label.orderSummary.incVATText') : translate('label.orderSummary.excVATText') }
                          </span>
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="flex flex-col font-semibold text-red-500">
                          {translate('label.orderSummary.freeText')}
                        </span>
                        <span className="flex flex-col font-semibold text-black">
                        {translate('label.product.qtyText')} {product?.qty}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="justify-end">
                    <span className="flex flex-col font-semibold text-black">
                    {translate('label.product.qtyText')} {product?.qty}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

export default BasketItems
