import { roundToDecimalPlaces } from '@framework/utils/parse-util'
import ApplyMembershipCard from './ApplyMembershipCard'
import MembershipPromotionCard from './MembershipPromotionCard'
import AppliedMembershipCard from './AppliedMembershipCard'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useUI } from '@components/ui/context'
import { Guid } from '@commerce/types'
import { NEXT_APPLY_PROMOTION, NEXT_MEMBERSHIP_BENEFITS } from '@components/utils/constants'
import { logError } from '@framework/utils/app-util'
import { useTranslation } from '@commerce/utils/use-translation'

const MembershipOfferCard = ({ setOpenOMM, defaultDisplayMembership, basket, refreshBasket, }: any) => {
  const translate = useTranslation()
  const lowestMemberShipPrice = defaultDisplayMembership?.membershipPrice

  const currencySymbol = basket?.grandTotal?.currencySymbol
  const [moneySaved, setMoneySaved] = useState(0)
  const [voucherCount, setVoucherCount] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [membership, setMembership] = useState<any>([])
  const [appliedBenefit, setAppliedBenefit] = useState<any>()
  const { user, setOverlayLoaderState, hideOverlayLoaderState, } = useUI()

  const fetchMemberShipBenefits = async () => {
    setOverlayLoaderState({ visible: true, message: translate('common.message.loaderLoadingText'), })
    setAppliedBenefit(false)
    const membershipItem = basket?.lineItems?.find( (x: any) => x?.isMembership )
    const userId = membershipItem ? null : user?.userId !== Guid.empty ? user?.userId : null
    const data = { userId, basketId: basket?.id, membershipPlanId: null }
    try {
      const { data: membershipBenefitsResult } = await axios.post( NEXT_MEMBERSHIP_BENEFITS, data )
      if (membershipBenefitsResult?.result) {
        const membershipPlans = membershipBenefitsResult?.result
        setMembership(membershipPlans)
        const membershipVouchers: Array<string> = membershipPlans?.benefits?.map((plan: any) => plan?.voucher)
        if (membershipVouchers?.length) {
          const findAppliedVouchersInBasket = basket?.promotionsApplied?.find((promo:any)=> membershipVouchers?.includes(promo?.promoCode))
          if (findAppliedVouchersInBasket) {
            setAppliedBenefit(membershipPlans?.benefits?.find((plan: any) => plan?.voucher === findAppliedVouchersInBasket?.promoCode))
          }
        }
      }
      hideOverlayLoaderState()
    } catch (error) {
      logError(error)
      hideOverlayLoaderState()
    }
  }

  useEffect(() => {

    if (basket?.lineItems?.length) {
      fetchMemberShipBenefits()
    }
  }, [ basket, basket?.id, basket?.lineItems])

  useEffect(() => {
    let discount = defaultDisplayMembership?.membershipPromoDiscountPerc
    if (membership) {
      const count = membership?.benefits?.filter( (x: any) => x?.status === 0 )?.length
      setVoucherCount(count)
      discount = membership?.benefits?.[0]?.discountPct
      setDiscount(discount)
    }
    if (discount) {
      let grandTotal = basket?.grandTotal?.raw?.withTax
      if (basket?.lineItems?.find((x: any) => x?.isMembership)?.isMembership) {
        grandTotal = basket?.lineItems ?.filter((x: any) => !x?.isMembership).reduce((accumulator: any, lineItem: any) => { return accumulator + lineItem?.price?.raw?.withTax }, 0)
      }
      grandTotal = (grandTotal * discount * 1.0) / 100.0
      setMoneySaved(roundToDecimalPlaces(grandTotal))
    }
  }, [membership])

  const handleApplyDiscount = () => {
    setOverlayLoaderState({ visible: true, message: translate('common.message.loaderLoadingText'), })
    const value = membership?.benefits?.find((x:any)=> x?.status === 0)?.voucher;
    const handleSubmit = async ( method: string = 'apply', promoCode: string = value ) => {
      try {
        const { data }: any = await axios.post(NEXT_APPLY_PROMOTION, { basketId :basket?.id, promoCode, method, })
        if (data?.result) { 
          if (refreshBasket) { 
            refreshBasket() 
          } 
        } 
        hideOverlayLoaderState()
        return data?.result?.isVaild ?? false
      } catch (error) {
        logError(error)
        hideOverlayLoaderState()
      }
      return false
    }
    handleSubmit()
  };

  return( basket?.hasMembership && !!appliedBenefit ? (
    <AppliedMembershipCard promo={appliedBenefit} currencySymbol={currencySymbol} moneySaved={moneySaved} membership={membership} />
  ) : basket?.hasMembership ? (
    <ApplyMembershipCard
      basket={basket}
      currencySymbol={currencySymbol}
      refreshBasket={refreshBasket}
      voucherCount={voucherCount}
      membership={membership}
      discount={discount}
      moneySaved={moneySaved}
      handleApplyDiscount={handleApplyDiscount}
    />
  ) : (
    <MembershipPromotionCard
      moneySaved={moneySaved}
      defaultDisplayMembership={defaultDisplayMembership}
      lowestMemberShipPrice={lowestMemberShipPrice}
      currencySymbol={currencySymbol}
      setOpenOMM={setOpenOMM}
    />
  ))
}

export default MembershipOfferCard
