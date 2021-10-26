import { Tab, Disclosure } from '@headlessui/react'
import { HeartIcon, MinusSmIcon, PlusSmIcon } from '@heroicons/react/outline'
import { StarIcon, PlayIcon } from '@heroicons/react/solid'
import classNames from '@components/utils/classNames'

const colorRegex = /^#(?:[0-9a-f]{3}){1,2}$/i

const Attributes = ({ attributes = [] }: any) => {
  return (
    <table className="text-gray-900">
      <tbody>
        {attributes.map((attr: any, idx: number) => {
          return (
            <tr>
              <th className="border text-left px-5 py-5">{attr.display}</th>
              <td className="border text-left px-5 py-5">
                {colorRegex.test(attr.value) ? (
                  <div
                    className="h-6 w-6 rounded-full mr-2 mt-2 border border-gray-100"
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

export default function ProductDetails({ product }: any) {
  const detailsConfig = [
    {
      title: 'Description',
      InnerComponent: (props: any) => (
        <div
          className="text-gray-700 space-y-6"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      ),
    },
    {
      title: 'Product specification',
      InnerComponent: (props: any) => <Attributes {...props} />,
    },
    {
      title: 'Shipping',
      InnerComponent: (props: any) => (
        <p className="text-gray-900">
          {props.shippingMessage || 'SHIPPING CONTENT TO BE ADDED'}
        </p>
      ),
    },
    {
      title: 'Returns',
      InnerComponent: (props: any) => (
        <p className="text-gray-900">
          {props.returnsMessage || 'RETURNS CONTENT TO BE ADDED'}
        </p>
      ),
    },
  ]
  return (
    <div className="border-t divide-y divide-gray-200">
      {detailsConfig.map((detail: any) => (
        <Disclosure as="div" key={detail.name}>
          {({ open }) => (
            <>
              <h3>
                <Disclosure.Button className="group relative w-full py-6 flex justify-between items-center text-left">
                  <span
                    className={classNames(
                      open ? 'text-indigo-600' : 'text-gray-900',
                      'text-sm font-medium'
                    )}
                  >
                    {detail.title}
                  </span>
                  <span className="ml-6 flex items-center">
                    {open ? (
                      <MinusSmIcon
                        className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                        aria-hidden="true"
                      />
                    ) : (
                      <PlusSmIcon
                        className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </Disclosure.Button>
              </h3>
              <Disclosure.Panel as="div" className="pb-6 prose prose-sm">
                {detail.InnerComponent({ attributes: product.attributes })}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  )
}
