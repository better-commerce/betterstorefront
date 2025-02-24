import moment from 'moment';
import { DATE_FORMAT, NEXT_DOWNLOAD_VOUCHERS } from '@components/utils/constants';
import VoucherStatus from './VoucherStatus';
import axios from 'axios';
import { LoadingDots, useUI } from '@components/ui';
import { useEffect, useState } from 'react';


export default function VoucherDetailsExpanded({
  membership,
  manageMembership,
  discountPerc,
  setExpandVoucher,
  voucherLeft,
  voucherUsed
}: any) {

  const { user } = useUI()
  const benefitsAvailable: any[] = membership?.benefits?.filter((x: any) => { return x?.status === 0; });
  const benefitsUsed: any[] = membership?.benefits?.filter((x: any) => { return x?.status === 1; });
  const formatDate = (dateString: string) => { return moment(dateString).format(DATE_FORMAT); };
  const [Download, setDownload] = useState(null)

  const handleManageMembership = () => {
    setExpandVoucher(false)
    manageMembership(true)
  }

  const handleGoBackButton = () => {
    setExpandVoucher(false)
  }

  const handleDownloadVoucher = () => {
    const downloadVoucher = async () => {
      const data = { userId: user?.userId, voucherCode: benefitsAvailable?.[0]?.voucher }
      const { data: response } = await axios.post(NEXT_DOWNLOAD_VOUCHERS, data)
      setDownload(response?.result?.url)
    }
    downloadVoucher()
  }

  useEffect(() => { handleDownloadVoucher() }, [])


  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <div className="relative w-full">
        <button className="absolute top-0 right-0 font-bold text-emerald-400 underlined" onClick={handleGoBackButton} >Go Back to My Membership</button>
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
        <h3 className="mb-2 text-lg font-semibold">
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
        <h3 className="mb-2 text-lg font-semibold">Upgrade your membership</h3>
        <p className="text-sm">
          Get more {discountPerc}% off vouchers by upgrading your membership
          plan at any time.
        </p>
        <button onClick={handleManageMembership} className="px-4 py-2 my-4 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700" >
          MANAGE MEMBERSHIP
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600"> FYI: Vouchers expire on the date shown within each voucher below. </p>
      </div>
      {benefitsAvailable?.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-lg font-semibold"> Redeem your next voucher </h3>
          <div className="p-4 border border-gray-300 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={benefitsAvailable?.[0]?.voucherBarCodeUrl} alt="Barcode" className="h-8 mr-4" />
                <div>
                  <p className="text-sm font-semibold"> {benefitsAvailable?.[0]?.promoName} </p>
                  <p className="text-sm text-gray-600"> Promotional Code : {benefitsAvailable?.[0]?.voucher} </p>
                  <p className="text-sm text-gray-600"> ExpiryDate : {formatDate(benefitsAvailable?.[0]?.validityEnd)} </p>
                </div>
              </div>
              {Download ?
                (<a href={Download} target="_blank" rel="noopener noreferrer" className="px-4 py-2 font-semibold rounded text-emerald-500 hover:text-emerald-700">Download for in-store use</a>)
                : <LoadingDots />}
            </div>
          </div>
        </div>
      )}
      {benefitsAvailable?.length > 1 && (
        <div>
          <h3 className="mb-2 text-lg font-semibold"> Upcoming voucher's ({benefitsAvailable?.length - 1}) </h3>
          {benefitsAvailable.slice(1).map((benefit, index) => (
            <div key={index} className="p-4 mb-2 border border-gray-300 rounded-md">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{benefit?.promoName}</p>
                <p className="text-xs font-semibold text-black"> Expiry Date : <span className='font-normal'>{formatDate(benefit?.validityEnd)}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
      {benefitsUsed?.length &&
        <div className="my-4">
          <h3 className="mb-2 text-lg font-semibold"> Redeemed Vouchers ({voucherUsed})</h3>
          {benefitsUsed?.map((benefit: any) => {
            return (
              <div key={benefit?.voucher} className="p-4 mb-2 border border-gray-300 rounded-md opacity-65">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={benefit?.voucherBarCodeUrl} alt="Barcode" className="h-8 mr-4" />
                    <div>
                      <p className="text-sm font-semibold"> {benefit?.promoName} </p>
                      <p className="text-sm text-gray-600"> Promotional Code : {benefit?.voucher} </p>
                      <p className="text-sm text-gray-600"> Claimed Date : {formatDate(benefit?.claimDate)} </p>
                    </div>
                  </div>
                  {/* <div onClick={()=>showOrderDetail(benefit)} className="px-4 py-2 font-semibold rounded cursor-pointer text-emerald-500 hover:text-emerald-700">
                  View Order
                  </div> */}
                </div>
              </div>
            )
          })}
        </div>
      }
    </div>
  )
}
