import VoucherStatus from "./VoucherStatus";
import { useTranslation } from '@commerce/utils/use-translation';
import { stringFormat } from "@framework/utils/parse-util";

const VoucherDetails = ({ voucherUsed, currencySymbol, savedAmount, voucherLeft, voucherCount, defaultDisplayMembership, setExpandVoucher }:any) => {
  const translate = useTranslation()
  const handleExpandVoucher = () => {
    setExpandVoucher(true)
  }
  return (
    <div className="bg-white border p-6 rounded-lg shadow-md flex flex-col w-full justify-between">
      <h2 className="text-2xl font-semibold sm:text-3xl">{stringFormat(translate('label.membership.voucherUsedHeadingText'), { voucherUsed, membershipPromoDiscountPerc: defaultDisplayMembership?.membershipPromoDiscountPerc })}</h2>
      <p className="text-lg font-semibold mb-4">{stringFormat(translate('label.membership.usedVoucherSavingYouText'), { currencySymbol, savedAmount })}</p>
      <p className="mb-2">{stringFormat(translate('label.membership.vouchersAvailableText'), { voucherLeft, voucherCount })}</p>
      <div className="w-full mb-4">
        <VoucherStatus voucherLeft={voucherLeft} voucherCount={voucherCount} />
      </div>
      <button onClick={handleExpandVoucher} className="flex items-center justify-center btn btn-secondary w-full !font-medium">
        {translate('label.membership.downloadVouchersBtnText')}
      </button>
    </div>
  );
};

export default VoucherDetails;