import React, { useState } from 'react'
import { useTranslation } from '@commerce/utils/use-translation'
import dynamic from 'next/dynamic'
import BenefitItems from './BenefitItems'
import cartHandler from "@components/services/cart";
import MembershipPlanList from './MembershipPlanList'
import { roundToDecimalPlaces } from '@framework/utils/parse-util';
import { useUI } from "@components/ui";
import Router from 'next/router'
const Button = dynamic(() => import('@components/ui/IndigoButton'))

const FIRST_MEMBERSHIP_SELECTED_AS_DEFAULT = true

const OptMembershipModal = ({ open, basket, setOpenOMM, allMembershipPlans, defaultDisplayMembership , refreshBasket=() => {} }:any) => {
  if (!open) return null
  const translate = useTranslation()
  const { user } = useUI();
  const membershipPlans = allMembershipPlans.sort((a:any, b:any) => a?.displayOrder - b?.displayOrder)
  const currencySymbol = basket?.grandTotal?.currencySymbol
  const [selectedPlan, setSelectedPlan] = useState(FIRST_MEMBERSHIP_SELECTED_AS_DEFAULT? membershipPlans[0] : null)

  let grandTotal =  basket?.grandTotal?.raw?.withTax;
  grandTotal = (grandTotal * defaultDisplayMembership?.membershipPromoDiscountPerc * 1.0 / 100.00)
  const moneySaved = `${currencySymbol} ${roundToDecimalPlaces(grandTotal)}`

  const handleOptMembershipModal = () => setOpenOMM(false)
  const handlePlanSelection = (plan:any) => setSelectedPlan(plan)

  const buttonTitle = () => {
    let buttonConfig: any = {
      title: translate('label.basket.addToBagText'),
      action: async ( plan:any ) => {
        const item = await cartHandler()?.addToCart(
          {
            basketId: basket?.id,
            productId: plan?.recordId,
            qty: 1,
            manualUnitPrice: plan?.price?.raw?.withoutTax,
            stockCode: plan?.stockCode,
            userId: user?.userId,
            isAssociated: user?.isAssociated,
            isMembership: true,
          },
          'ADD',
          { plan }
        )
          if(refreshBasket){
            refreshBasket()
          }
          setOpenOMM(false)
      },
    }
    return buttonConfig
  }
  const buttonConfig = buttonTitle();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 max-w-md z-100">
        <div className="flex justify-end">
          <button onClick={handleOptMembershipModal} className="text-gray-500 hover:text-gray-700">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-4">
          {defaultDisplayMembership?.membershipPromoDiscountPerc && `GET ${defaultDisplayMembership?.membershipPromoDiscountPerc}% OFF + FREE DELIVERY`}
        </h2>
        <p className="mb-6 text-gray-600">
          {`That's currently a saving of ${moneySaved} on your order today when you become a`}
        </p>
        <h3 className="text-lg font-semibold mb-4">What you get as a member</h3>
        <BenefitItems defaultDisplayMembership={defaultDisplayMembership} />
        <MembershipPlanList
          membershipPlans={membershipPlans}
          defaultDisplayMembership={defaultDisplayMembership}
          selectedPlan={selectedPlan}
          handlePlanSelection={handlePlanSelection}
          firstMembershipSelectedAsDefault={FIRST_MEMBERSHIP_SELECTED_AS_DEFAULT}
        />
        <div className="flex justify-between mt-8">
        <Button className={'flex items-center justify-center btn btn-secondary w-full !font-medium'} title={buttonConfig.title} action={() => buttonConfig.action(selectedPlan)} buttonType={buttonConfig.type || 'cart'} />
        </div>
      </div>
    </div>
  )
}

export default OptMembershipModal