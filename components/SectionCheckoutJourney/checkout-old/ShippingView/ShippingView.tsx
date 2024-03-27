import { FC } from 'react'
import cn from 'classnames'

import Button from '@components//ui/Button'
import { useUI } from '@components//ui/context'
import SidebarLayout from '@components//shared/SidebarLayout/SidebarLayout'
import useAddAddress from '@framework/customer/address/use-add-item'

import s from './ShippingView.module.css'
import { useTranslation } from '@commerce/utils/use-translation'

interface Form extends HTMLFormElement {
  cardHolder: HTMLInputElement
  cardNumber: HTMLInputElement
  cardExpireDate: HTMLInputElement
  cardCvc: HTMLInputElement
  firstName: HTMLInputElement
  lastName: HTMLInputElement
  company: HTMLInputElement
  streetNumber: HTMLInputElement
  zipCode: HTMLInputElement
  city: HTMLInputElement
  country: HTMLSelectElement
}

const PaymentMethodView: FC<React.PropsWithChildren<unknown>> = () => {
  const translate = useTranslation()
  const { setSidebarView } = useUI()
  const addAddress = useAddAddress()

  async function handleSubmit(event: React.ChangeEvent<Form>) {
    event.preventDefault()

    await addAddress({
      type: event.target.type.value,
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      company: event.target.company.value,
      streetNumber: event.target.streetNumber.value,
      apartments: event.target.streetNumber.value,
      zipCode: event.target.zipCode.value,
      city: event.target.city.value,
      country: event.target.country.value,
    })

    setSidebarView('CHECKOUT_VIEW')
  }

  return (
    <form className="h-full" onSubmit={handleSubmit}>
      <SidebarLayout handleBack={() => setSidebarView('CHECKOUT_VIEW')}>
        <div className="flex-1 px-4 sm:px-6">
          <h2 className="inline-block pt-1 pb-8 text-2xl font-semibold tracking-wide cursor-pointer">
            {translate('label.orderSummary.shippingText')}
          </h2>
          <div>
            <div className="flex flex-row items-center my-3">
              <input name="type" className={s.radio} type="radio" />
              <span className="ml-3 text-sm">{translate('common.label.sameAsBillingAddress')}</span>
            </div>
            <div className="flex flex-row items-center my-3">
              <input name="type" className={s.radio} type="radio" />
              <span className="ml-3 text-sm">
                {translate('common.label.useADifferentShippingAddText')}
              </span>
            </div>
            <hr className="my-6 border-accent-2" />
            <div className="grid grid-flow-row grid-cols-12 gap-3">
              <div className={cn(s.fieldset, 'col-span-6')}>
                <label className={s.label}>{translate('label.addressBook.firstNameText')}</label>
                <input name="firstName" className={s.input} />
              </div>
              <div className={cn(s.fieldset, 'col-span-6')}>
                <label className={s.label}>{translate('label.addressBook.lastNameText')}</label>
                <input name="lastName" className={s.input} />
              </div>
            </div>
            <div className={s.fieldset}>
              <label className={s.label}>{translate('common.label.companyOptionalText')}</label>
              <input name="company" className={s.input} />
            </div>
            <div className={s.fieldset}>
              <label className={s.label}>{translate('label.checkout.streetAndHouseNoText')}</label>
              <input name="streetNumber" className={s.input} />
            </div>
            <div className={s.fieldset}>
              <label className={s.label}>
                {translate('label.checkout.appartmentSuiteEtcText')}
              </label>
              <input name="apartments" className={s.input} />
            </div>
            <div className="grid grid-flow-row grid-cols-12 gap-3">
              <div className={cn(s.fieldset, 'col-span-6')}>
                <label className={s.label}>{translate('common.label.postcodeText')}</label>
                <input name="zipCode" className={s.input} />
              </div>
              <div className={cn(s.fieldset, 'col-span-6')}>
                <label className={s.label}>{translate('label.addressBook.townCityText')}</label>
                <input name="city" className={s.input} />
              </div>
            </div>
            <div className={s.fieldset}>
              <label className={s.label}>{translate('label.checkout.countryText')}</label>
              <select name="country" className={s.select}>
                <option>{translate('label.checkout.deafultCountryDropdownText')}</option>
              </select>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 left-0 right-0 z-20 w-full px-6 py-12 border-t bg-accent-0 border-accent-2">
          <Button type="submit" width="100%" variant="ghost">
            {translate('common.label.continueBtnText')}
          </Button>
        </div>
      </SidebarLayout>
    </form>
  )
}

export default PaymentMethodView
