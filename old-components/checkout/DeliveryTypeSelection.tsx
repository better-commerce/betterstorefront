import {
  BETTERCOMMERCE_DEFAULT_COUNTRY,
  NEXT_SHIPPING_ENDPOINT,
} from '@components/utils/constants'
import { RadioGroup } from '@headlessui/react'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { postData } from '@components/utils/clientFetcher'
import { useUI } from '@components/ui'
import { groupBy } from 'lodash'
import { TruckIcon, CubeIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@commerce/utils/use-translation'

interface DeliveryTypeSelectionProps {
  basket: any
  deliveryTypeMethod: any
  setDeliveryTypeMethod: any
  featureToggle?: any
}

const DeliveryTypeSelection = ({
  basket,
  deliveryTypeMethod,
  setDeliveryTypeMethod,
  featureToggle,
}: DeliveryTypeSelectionProps) => {
  const translate = useTranslation()
  const DELIVERY_METHODS_TYPE = [
    {
      id: 0,
      title: 'Deliver',
      content: translate('label.checkout.toChoiceAddressText'),
      children: [],
      type: 1,
    },
    {
      id: 1,
      type: 2,
      title: 'Collect',
      content: translate('common.label.inStoreUsingCollectPlusText'),
      children: [],
    },
  ]
  const [deliveryMethods, setDeliveryMethods] = useState(DELIVERY_METHODS_TYPE)
  const { basketId } = useUI()
  const loadDeliveryMethods = async (shippingAddress: any) => {
    const response = await postData(NEXT_SHIPPING_ENDPOINT, {
      basketId,
      countryCode:
        shippingAddress?.countryCode || BETTERCOMMERCE_DEFAULT_COUNTRY,
    })
    if (response.length) {
      const tempArrNew = groupBy(response, 'type')
      const output = new Array<any>()
      Object.entries(tempArrNew)?.forEach(([key, value]) => {
        const data: any = DELIVERY_METHODS_TYPE?.find(
          (o: any) => o.type === parseInt(key)
        )
        data.children = value
        output.push(data)
      })
      setDeliveryMethods(output)
      if(deliveryTypeMethod) {
        setDeliveryTypeMethod(output[deliveryTypeMethod?.id])
      } else {
        setDeliveryTypeMethod(output[0])
      }
    }
  }
  useEffect(() => {
    if(basket?.shippingAddress?.id){
      loadDeliveryMethods(basket?.shippingAddress)
    } else {
      loadDeliveryMethods(null)
    }
  }, [])
  return (
    <>
      <h5 className="mt-4 mb-2 font-medium text-black font-18 sm:mt-6 sm:mb-4">
        {translate('label.checkout.deliveryTypeText')}
      </h5>

      <div className="flex justify-between w-full gap-4">
        <RadioGroup
          value={deliveryTypeMethod}
          onChange={(newSelectedDeliveryMethod) => {
            setDeliveryTypeMethod(newSelectedDeliveryMethod)
          }}
          className="w-full gap-4"
        >
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            {deliveryMethods?.map(
              (deliveryMethod: any, deliveryIdx: any) =>
                !!deliveryMethod.children.length && (
                  <RadioGroup.Option
                    key={deliveryIdx}
                    value={deliveryMethod}
                    className={({ checked, active }) =>
                      classNames(
                        checked ? 'border-transparent' : 'border-gray-300',
                        active ? 'ring-emerald-500' : '',
                        'relative bg-white border shadow-sm p-4 w-full flex rounded-md cursor-pointer focus:outline-none'
                      )
                    }
                  >
                    {({ checked, active }) => (
                      <>
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col items-center p-4 text-center rounded">
                            <RadioGroup.Label
                              as="span"
                              className="block font-bold text-gray-900 uppercase text-md"
                            >
                              <span
                                className={classNames(
                                  active ? '' : '',
                                  checked ? 'bg-emerald-500' : 'bg-gray-100',
                                  'flex items-center justify-center w-16 h-16 mb-3 rounded-full '
                                )}
                              >
                                {deliveryMethod?.type == 1 ? (
                                  <>
                                    <TruckIcon
                                      className={classNames(
                                        active ? '' : '',
                                        checked
                                          ? 'text-white'
                                          : 'text-gray-300',
                                        'w-8 h-8 '
                                      )}
                                    />
                                  </>
                                ) : (
                                  <>
                                    <CubeIcon
                                      className={classNames(
                                        active ? '' : '',
                                        checked
                                          ? 'text-white'
                                          : 'text-gray-300',
                                        'w-8 h-8 '
                                      )}
                                    />
                                  </>
                                )}
                              </span>
                              {deliveryMethod.title}
                            </RadioGroup.Label>
                            <RadioGroup.Description
                              as="span"
                              className="flex items-center mt-1 text-sm text-gray-500"
                            >
                              {deliveryMethod.content}
                            </RadioGroup.Description>
                          </div>
                        </div>
                        <div
                          className={classNames(
                            active ? 'border' : 'border',
                            checked
                              ? 'border-emerald-500'
                              : 'border-transparent',
                            'absolute -inset-px pointer-events-none rounded'
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </RadioGroup.Option>
                )
            )}
          </div>
        </RadioGroup>
      </div>
    </>
  )
}

export default DeliveryTypeSelection
