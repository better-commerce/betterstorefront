const AppliedMembershipCard = ({ promo, currencySymbol, moneySaved }:any) => {
  console.log(promo)
  return (
    <div className="bg-gray-200 p-6 rounded-lg mt-2 text-center">
      <p className="text-black font-semibold mb-4">{`${promo?.discountPct}% discount applied!`}</p>
      <p className="text-black font-semibold mb-6">{`You Saved ${currencySymbol}${moneySaved}`}</p>
    </div>
  );
};

export default AppliedMembershipCard;