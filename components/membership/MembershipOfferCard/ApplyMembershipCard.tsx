

const ApplyMembershipCard = ({ currencySymbol, membership, moneySaved, handleApplyDiscount, voucherCount }:any) => {

  return (
    <div className="bg-indigo-800 p-6 rounded-lg mt-2 text-center">
      <div className="flex items-center justify-center text-white text-2xl font-bold mb-4">
        <img src="/theme/blue/image/logo.png?fm=webp&h=200" width="60" height="60" alt="Store" className="brand-logo" />
      </div>
      <p className="text-white font-semibold mb-4">{membership?.name}</p>
      <p className="text-yellow-300 font-semibold mb-6">
        {!!moneySaved && `Apply your ${membership?.benefits?.[0]?.discountPct}% OFF discount to save ${currencySymbol}${moneySaved}`}
      </p>
      <button onClick={handleApplyDiscount} className="bg-white text-indigo-900 font-semibold py-2 px-4 rounded-md mb-4">
        APPLY DISCOUNT
      </button>
      <p className="text-white">{voucherCount && `You have ${voucherCount} discounts remaining`}</p>
    </div>
  );
};

export default ApplyMembershipCard;