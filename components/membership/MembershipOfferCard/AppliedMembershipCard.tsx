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
    <div className="p-6 mt-2 text-center border-2 border-dashed rounded-lg bg-sky-50 border-sky-300">
      <p className="mb-4 font-semibold text-black">{`${promo?.discountPct}% ${translate('label.membership.discountAppliedText')}`}</p>
      <p className="mb-6 font-semibold text-black">{`${translate('label.membership.youSavedText')} ${currencySymbol}${moneySaved}`}</p>
      <p className="mb-6 font-semibold text-black">{noOfDiscounts && `${stringFormat(translate('label.membership.noOfDiscountsRemainingText'), { noOfDiscounts })}`}</p>
    </div>
  )
}

export default AppliedMembershipCard
