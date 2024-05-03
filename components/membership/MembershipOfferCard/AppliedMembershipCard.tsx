import { EmptyString } from "@components/utils/constants"
import { useMemo } from "react"

const AppliedMembershipCard = ({ promo, currencySymbol, moneySaved, membership, }: any) => {

  const noOfDiscounts = useMemo(() => {
    if (membership?.benefits && promo?.voucher) {
      return membership?.benefits?.filter((x: any) => x?.voucher !== promo?.voucher)?.length || null
    }
    return null
  }, [promo, membership])

  return (
    <div className="bg-gray-200 p-6 rounded-lg mt-2 text-center">
      <p className="text-black font-semibold mb-4">{`${promo?.discountPct}% discount applied!`}</p>
      <p className="text-black font-semibold mb-6">{`You Saved ${currencySymbol}${moneySaved}`}</p>
      <p className="text-black font-semibold mb-6">{noOfDiscounts && `You have ${noOfDiscounts} discounts remaining`}</p>
    </div>
  )
}

export default AppliedMembershipCard
