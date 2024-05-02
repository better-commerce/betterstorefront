

const ApplyMembershipCard = ({ currencySymbol, membership, moneySaved, handleApplyDiscount, voucherCount }:any) => {

  return (
    <div className="bg-gray-200 p-6 rounded-lg mt-2 text-center">
      <p className="text-white font-semibold mb-4">{membership?.name}</p>
      <p className="text-black font-semibold mb-6">
        {!!moneySaved && `Apply your ${membership?.benefits?.[0]?.discountPct}% OFF discount to save ${currencySymbol}${moneySaved}`}
      </p>
      <button onClick={handleApplyDiscount} className="bg-white text-black font-semibold py-2 px-4 rounded-md mb-4">
        APPLY DISCOUNT
      </button>
      <p className="text-black">{voucherCount && `You have ${voucherCount} discounts remaining`}</p>
    </div>
  );
};

export default ApplyMembershipCard;