import moment from 'moment';
import { DATE_FORMAT } from '@components/utils/constants';
import VoucherStatus from './VoucherStatus';

export default function VoucherDetailsExpanded({
  membership,
  manageMembership,
  discountPerc,
  setExpandVoucher,
  voucherLeft,
  voucherUsed
}: any) {
    const benefitsAvailable: any[] = membership?.benefits?.filter((x: any) => {
        return x?.status === 0;
    });
    const benefitsUsed: any[] = membership?.benefits?.filter((x: any) => {
        return x?.status === 1;
    });

    const formatDate = (dateString: string) => {
        return moment(dateString).format(DATE_FORMAT);
    };
    
  const handleManageMembership = () => {
    setExpandVoucher(false)
    manageMembership(true)
  }

  const handleGoBackButton = () => {
    setExpandVoucher(false)
  }

  return (
    <div className="bg-gray-100 p-4 rounded-md">
        <div className="w-full relative">
            <button className="  text-emerald-400 font-bold  underlined absolute top-0 right-0 " onClick={handleGoBackButton} >Go Back to My Membership</button>
        </div>
        <div className="p-4 m-4">
            <div className="flex items-center">
                <VoucherStatus voucherLeft={voucherLeft} />
            </div>
            <p className="text-sm font-semibold">
                {voucherLeft}X {discountPerc}% off voucher(s) remaining 
            </p>
        </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">
          How to use your voucher(s):
        </h3>
        <ul className="list-disc list-inside">
          <li>Use your {discountPerc}% off voucher easily online or in-store</li>
          <li>Online: just apply your voucher at checkout</li>
          <li>
            In-store: download your latest voucher and show a member of staff
            when you're ready to purchase
          </li>
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Upgrade your membership</h3>
        <p className="text-sm">
          Get more {discountPerc}% off vouchers by upgrading your membership
          plan at any time.
        </p>
        <button onClick={handleManageMembership} className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 my-4 px-4 rounded" >
          MANAGE MEMBERSHIP
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600"> FYI: Vouchers expire on the date shown within each voucher below. </p>
      </div>
      {benefitsAvailable?.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2"> Redeem your next voucher </h3>
          <div className="border border-gray-300 p-4 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={benefitsAvailable?.[0]?.voucherBarCodeUrl} alt="Barcode" className="h-8 mr-4" />
                <div>
                  <p className="text-sm font-semibold"> {benefitsAvailable?.[0]?.promoName} </p>
                  <p className="text-sm text-gray-600"> Promotional Code : {benefitsAvailable?.[0]?.voucher} </p>
                  <p className="text-sm text-gray-600"> ExpiryDate : {formatDate(benefitsAvailable?.[0]?.validityEnd)} </p>
                </div>
              </div>
              <button className="bg-emerald-500 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded">
                Download for in-store use
              </button>
            </div>
          </div>
        </div>
      )}
      {benefitsAvailable?.length > 1 && (
        <div>
            <h3 className="text-lg font-semibold mb-2"> Upcoming voucher(s) ({benefitsAvailable?.length - 1}) </h3>
                {benefitsAvailable.slice(1).map((benefit, index) => (
                    <div key={index} className="border border-gray-300 p-4 rounded-md">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold">{benefit?.promoName}</p>
                            <p className="text-sm text-gray-600"> ExpiryDate : {formatDate(benefit?.validityEnd)} </p>
                        </div>
                    </div>
                ))}
        </div>
      )}
        {benefitsUsed?.length &&
            <div className="m-4 bg-white ">
            <h3 className="text-lg font-semibold mb-2"> Redeemed Voucher(s) ({voucherUsed})</h3>
            {benefitsUsed?.map((benefits: any) =>{ 
                console.log("benefits",benefits)
                return(
                    <div className="border border-gray-300 p-4 rounded-md">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={benefits?.voucherBarCodeUrl} alt="Barcode" className="h-8 mr-4" />
                                <div>
                                    <p className="text-sm font-semibold"> {benefits?.promoName} </p>
                                    <p className="text-sm text-gray-600"> Promotional Code : {benefits?.voucher} </p>
                                    <p className="text-sm text-gray-600"> Claimed Date : {formatDate(benefits?.claimDate)} </p>
                                </div>
                            </div>
                            <div className="text-emerald-500 hover:text-emerald-700 font-semibold py-2 px-4 rounded cursor-pointer">
                            View Order
                            </div>
                        </div>
                    </div>
                )
            })}

            </div>
        }
    </div>
  )
}
