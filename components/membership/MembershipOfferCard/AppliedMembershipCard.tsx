import { useMemo } from "react"
import { useTranslation } from "@commerce/utils/use-translation"
import { stringFormat } from "@framework/utils/parse-util"

const AppliedMembershipCard = ({ promo, currencySymbol, moneySaved, membership, }: any) => {
  const translate = useTranslation()
  const noOfDiscounts = useMemo(() => {
    if (membership?.benefits && promo?.voucher) {
      return membership?.benefits?.filter((x: any) => x?.voucher !== promo?.voucher)?.length || null
    }
    return null
  }, [promo, membership])

  return (
    <div className="bg-gray-200 p-6 rounded-lg mt-2 text-center">
      <p className="text-black font-semibold mb-4">{`${promo?.discountPct}% ${translate('label.membership.discountAppliedText')}`}</p>
      <p className="text-black font-semibold mb-6">{`${translate('label.membership.youSavedText')} ${currencySymbol}${moneySaved}`}</p>
      <p className="text-black font-semibold mb-6">{noOfDiscounts && `${stringFormat(translate('label.membership.noOfDiscountsRemainingText'), { noOfDiscounts })}`}</p>
    </div>
  )
}

export default AppliedMembershipCard
