import { roundToDecimalPlaces } from '@framework/utils/parse-util'
import ApplyMembershipCard from './ApplyMembershipCard'
import MembershipPromotionCard from './MembershipPromotionCard'
import AppliedMembershipCard from './AppliedMembershipCard'
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useUI } from '@components/ui/context'
import { Guid } from '@commerce/types'
import { NEXT_APPLY_PROMOTION, NEXT_MEMBERSHIP_BENEFITS } from '@components/utils/constants'
import { logError } from '@framework/utils/app-util'
import { useTranslation } from '@commerce/utils/use-translation'

const MembershipOfferCard = ({ setOpenOMM, defaultDisplayMembership, membership, basket, setBasket = () => {}, }: any) => {
  const translate = useTranslation()
  const lowestMemberShipPrice = defaultDisplayMembership?.membershipPrice

  const currencySymbol = basket?.grandTotal?.currencySymbol
  const [moneySaved, setMoneySaved] = useState(0)
  const [voucherCount, setVoucherCount] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [appliedBenefit, setAppliedBenefit] = useState<any>()
  const { setOverlayLoaderState, hideOverlayLoaderState, setCartItems } = useUI()

  const fetchMemberShipBenefits = async () => {
    if(!!membership?.benefits?.length) {
      setOverlayLoaderState({ visible: true, message: translate('common.message.loaderLoadingText'), })
      setAppliedBenefit(false)
      try {
        const membershipVouchers: Array<string> = membership?.benefits?.map((plan: any) => plan?.voucher)
        if (membershipVouchers?.length) {
          const findAppliedVouchersInBasket = basket?.promotionsApplied?.find((promo:any)=> membershipVouchers?.includes(promo?.promoCode))
          if (findAppliedVouchersInBasket) {
            setAppliedBenefit(membership?.benefits?.find((plan: any) => plan?.voucher === findAppliedVouchersInBasket?.promoCode))
          }
        }
        
        hideOverlayLoaderState()
      } catch (error) {
        logError(error)
        hideOverlayLoaderState()
      }
    }
  }
  useEffect(() => {

    if (basket?.lineItems?.length) {
      fetchMemberShipBenefits()
    }
  }, [ membership, basket, basket?.id, basket?.lineItems])

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
          setBasket(data?.result?.basket)
          setCartItems(data?.result?.basket)
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

  /*const basketContainsMembershipProduct = useMemo(() => {
    return basket?.lineItems?.some((x: any) => x?.isMembership)
  }, [basket, basket?.lineItems])*/

  return( basket?.hasMembership && !!appliedBenefit ? (
    <AppliedMembershipCard promo={appliedBenefit} currencySymbol={currencySymbol} moneySaved={moneySaved} membership={membership} />
  ) : basket?.hasMembership /*&& basketContainsMembershipProduct*/ ? (
    <ApplyMembershipCard
      basket={basket}
      currencySymbol={currencySymbol}
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
