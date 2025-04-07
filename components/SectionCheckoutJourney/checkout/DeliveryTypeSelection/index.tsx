import classNames from 'classnames'
import { RadioGroup } from '@headlessui/react'
import { TruckIcon, CubeIcon } from '@heroicons/react/24/outline'

//
import { useTranslation } from '@commerce/utils/use-translation'
import withAddressSelection from './withAddressSelection'
import { CURRENT_THEME } from '@components/utils/constants'

interface DeliveryTypeSelectionProps {
  readonly basket: any
  readonly deliveryTypeMethod: any
  readonly featureToggle?: any
  setDeliveryTypeMethod: any
  deliveryMethods: any
  appConfig?: any
}

const DeliveryTypeSelection = ({ deliveryTypeMethod, setDeliveryTypeMethod, deliveryMethods = [], appConfig, }: DeliveryTypeSelectionProps) => {
  const translate = useTranslation()

  return (
    <>
      <h5 className="mt-4 mb-2 font-medium text-black font-18 sm:mt-6 sm:mb-4">{translate('label.checkout.deliveryTypeText')}</h5>

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
                  <RadioGroup.Option key={deliveryIdx} value={deliveryMethod} className={({ checked, active }) => classNames(checked ? 'border-transparent' : 'border-gray-300', active ? 'ring-emerald-500' : '', 'relative bg-white border shadow-sm p-2 w-full flex rounded-md cursor-pointer focus:outline-none')}>
                    {({ checked, active }) => (
                      <>
                        <div className="flex flex-col w-full">
                          <div className="flex p-1 rounded">
                            <RadioGroup.Label as="span" className="flex gap-x-5 font-bold text-gray-900 uppercase text-md">
                              {CURRENT_THEME === 'camera' && ( 
                                <div className={classNames(active ? '' : '', checked ? 'p-border-clr' : 'border-gray-300', 'w-5 h-5 flex rounded-full justify-center items-center mt-0.5')}>
                                  <span 
                                  className={classNames(active ? '' : '', checked ? 'p-border-clr p-bg-clr ' : 'border-gray-300 bg-gray-100', 'w-3 h-3 rounded-full')}></span>
                                </div>
                               )} 
                              <div className='p-none'>
                                <span className={classNames(active ? '' : '', checked ? 'p-border-clr' : 'bg-gray-100', 'flex items-center justify-center w-16 h-16 mb-3 rounded-full ')}>
                                  {deliveryMethod?.type == 1 ? (
                                    <>
                                      <TruckIcon className={classNames(active ? '' : '', checked ? 'text-white' : 'text-gray-300', 'w-8 h-8 p-none ')} />
                                    </>
                                  ) : (
                                    <>
                                      <CubeIcon className={classNames(active ? '' : '', checked ? 'text-white' : 'text-gray-300', 'w-8 h-8 p-none ')} />
                                    </>
                                  )}
                                </span>
                              </div>
                              <div>
                                <div>{deliveryMethod.title}</div>
                                <div className="flex mt-1 text-sm text-gray-500 lowercase font-normal">{deliveryMethod.content}</div>
                              </div>
                            </RadioGroup.Label>
                          </div>
                        </div>
                        <div className={classNames(active ? 'border' : 'border', checked ? 'p-border-clr' : 'border-transparent', 'absolute -inset-px pointer-events-none rounded')} aria-hidden="true" />
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

export default withAddressSelection(DeliveryTypeSelection)
