import { Disclosure } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'
import { PRODUCT_DESCRIPTION, GENERAL_SHIPPING, GENERAL_RETURNS } from '@components/utils/textVariables'
import { recordGA4Event } from '@components/services/analytics/ga4'

const colorRegex = /^#(?:[0-9a-f]{3}){1,2}$/i

const Attributes = ({ attributes = [] }: any) => {
  return (
    <table className="text-gray-900">
      <tbody>
        {attributes.map((attr: any, idx: number) => {
          return (
            <tr key={idx}>
              <th className="px-5 py-5 text-left border">{attr.display}</th>
              <td className="px-5 py-5 text-left border">
                {colorRegex.test(attr.value) ? (
                  <div
                    className="w-6 h-6 mt-2 mr-2 border border-gray-100 rounded-full"
                    style={{ backgroundColor: attr.value }}
                  />
                ) : (
                  attr.value
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default function ProductDetails({ product, description }: any) {
  const detailsConfig = [
    // {
    //   title: PRODUCT_SPECIFICATION,
    //   InnerComponent: (props: any) => <Attributes {...props} />,
    // },
    {
      title: GENERAL_SHIPPING,
      InnerComponent: (props: any) => (
        <p className="text-gray-900">
          {props.shippingMessage || (
            <span>
              We currently ship in the UK and worldwide.
              <br />
              <br />
              We accept payment via PayPal, Clearpay, and major card payment
              providers (including Visa, Mastercard, Maestro, and Switch) and
              more.
            </span>
          )}
        </p>
      ),
    },
    {
      title: GENERAL_RETURNS,
      InnerComponent: (props: any) => (
        <p className="text-gray-900">
          {props.returnsMessage || (
            <span>
              Items may be returned for a full refund within 14 days from the
              date an order was received.
            </span>
          )}
        </p>
      ),
    },
  ]

  const descriptionConfig = [
    {
      title: PRODUCT_DESCRIPTION,
      InnerComponent: (props: any) => (
        <div
          className="space-y-2 text-sm text-gray-700 sm:text-md sm:space-y-6 font-h2-desc"
          dangerouslySetInnerHTML={{ __html: description || '' }}
        />
      ),
    },
  ]

  function openSpecification() {
    if (typeof window !== 'undefined') {
      recordGA4Event(window, 'specification_product_detail', {
        category_selected: product?.mappedCategories[2]?.categoryName,
        header: product?.name,
        current_page: window.location.href,
      })
    }
  }

  return (
    <>
      <div className="border-b divide-y divide-gray-200">
        {descriptionConfig.map((desc: any, id: number) => (
          <Disclosure as="div" key={`${id}-desc-item`} defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button className="relative flex items-center justify-between w-full py-2 pr-2 text-left group sm:py-2">
                  <h2 className="font-bold text-black uppercase font-18">
                    {desc.title}
                  </h2>
                  <span className="flex items-center ml-6">
                    {open ? (
                      <MinusSmallIcon
                        className="block w-6 h-6 text-black group-hover:text-gray-700"
                        aria-hidden="true"
                      />
                    ) : (
                      <PlusSmallIcon
                        className="block w-6 h-6 text-black group-hover:text-gray-700"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </Disclosure.Button>
                <Disclosure.Panel as="div" className="pb-6 prose-sm prose">
                  {desc.InnerComponent({
                    attributes: product.customAttributes || product.attributes,
                  })}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
      <div className="border-b divide-y divide-gray-200 full-table">
        {detailsConfig.map((detail: any, idx: number) => (
          <Disclosure as="div" key={`${idx}-detail-item`}>
            {({ open }) => (
              <>
                <Disclosure.Button className="relative flex items-center justify-between w-full py-2 pr-2 text-left group sm:py-2">
                  <h2 className="font-bold text-black uppercase font-18">
                    {detail.title}
                  </h2>
                  <span className="flex items-center ml-6">
                    {open ? (
                      <MinusSmallIcon
                        className="block w-6 h-6 text-black group-hover:text-gray-700"
                        aria-hidden="true"
                      />
                    ) : (
                      <PlusSmallIcon
                        className="block w-6 h-6 text-black group-hover:text-gray-700"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </Disclosure.Button>
                <Disclosure.Panel as="div" className="pb-6 prose-sm prose">
                  {detail.InnerComponent({
                    attributes: product.customAttributes || product.attributes,
                  })}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </>
  )
}
