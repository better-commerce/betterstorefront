import { useTranslation } from "@commerce/utils/use-translation";
import { stringFormat } from "@framework/utils/parse-util"

const ApplyMembershipCard = ({ currencySymbol, membership, moneySaved, handleApplyDiscount, voucherCount }:any) => {
  const translate = useTranslation()
  const applyMembershipText = translate('label.membership.applyMembershipText')
  return (
    <div className="p-6 mt-2 text-center border-2 border-dashed rounded-lg bg-sky-50 border-sky-300">
      <p className="mb-4 font-semibold text-white">{membership?.name}</p>
      <p className="mb-6 font-medium text-black">
        {!!moneySaved && (membership?.benefits?.length > 0) && <>{stringFormat(applyMembershipText, { discountPct: membership?.benefits?.[0]?.discountPct, moneySaved: `${currencySymbol}${moneySaved}` })}</>}
      </p>
      <button onClick={handleApplyDiscount} className="px-6 py-2 mb-4 font-semibold text-black bg-white border rounded-md hover:bg-slate-100 border-slate-400">
        {translate('label.membership.applyDiscountText')}
      </button>
    </div>
  );
};

export default ApplyMembershipCard;