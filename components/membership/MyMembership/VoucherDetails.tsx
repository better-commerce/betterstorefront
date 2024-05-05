import VoucherStatus from "./VoucherStatus";
import { useTranslation } from '@commerce/utils/use-translation';
import { stringFormat } from "@framework/utils/parse-util";

const VoucherDetails = ({ voucherUsed, currencySymbol, savedAmount, voucherLeft, voucherCount, defaultDisplayMembership }:any) => {
  const translate = useTranslation()
  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-md flex flex-col  justify-between">
      <h2 className="text-2xl font-semibold sm:text-3xl">{stringFormat(translate('label.membership.voucherUsedHeadingText'), { voucherUsed, membershipPromoDiscountPerc: defaultDisplayMembership?.membershipPromoDiscountPerc })}</h2>
      <p className="text-lg font-semibold mb-4">{stringFormat(translate('label.membership.usedVoucherSavingYouText'), { currencySymbol, savedAmount })}</p>
      <div className="flex items-center mb-4">
        <VoucherStatus voucherLeft={voucherLeft} voucherCount={voucherCount} />
      </div>
      <button className="flex items-center justify-center btn btn-secondary w-full !font-medium">
        {translate('label.membership.downloadVouchersBtnText')}
      </button>
    </div>
  );
};

export default VoucherDetails;