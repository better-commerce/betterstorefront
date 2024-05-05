import { useTranslation } from "@commerce/utils/use-translation";
import { stringFormat } from "@framework/utils/parse-util"

const ApplyMembershipCard = ({ currencySymbol, membership, moneySaved, handleApplyDiscount, voucherCount }:any) => {
  const translate = useTranslation()
  const applyMembershipText = translate('label.membership.applyMembershipText')
  return (
    <div className="bg-gray-200 p-6 rounded-lg mt-2 text-center">
      <p className="text-white font-semibold mb-4">{membership?.name}</p>
      <p className="text-black font-semibold mb-6">
        {!!moneySaved && (membership?.benefits?.length > 0) && <>{stringFormat(applyMembershipText, { discountPct: membership?.benefits?.[0]?.discountPct, moneySaved: `${currencySymbol}${moneySaved}` })}</>}
      </p>
      <button onClick={handleApplyDiscount} className="bg-white text-black font-semibold py-2 px-4 rounded-md mb-4">
        {translate('label.membership.applyDiscountText')}
      </button>
      {/*<p className="text-black">{voucherCount && stringFormat(translate('label.membership.applyDiscountText'), { voucherCount })}</p>*/}
    </div>
  );
};

export default ApplyMembershipCard;