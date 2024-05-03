import VoucherStatus from "./VoucherStatus";

const VoucherDetails = ({ voucherUsed, savedAmount, voucherLeft, voucherCount }:any) => {
  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-md flex flex-col  justify-between">
      <h2 className="text-2xl font-semibold sm:text-3xl">YOU'VE USED {voucherUsed}X 20% OFF VOUCHERS</h2>
      <p className="text-lg font-semibold mb-4">SAVING YOU £{savedAmount}</p>
      <div className="flex items-center mb-4">
        <VoucherStatus voucherLeft={voucherLeft} voucherCount={voucherCount} />
      </div>
      <button className="flex items-center justify-center btn btn-secondary w-full !font-medium">
        Check or download your vouchers
      </button>
    </div>
  );
};

export default VoucherDetails;