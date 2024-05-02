const AppliedMembershipCard = ({ promo, currencySymbol, moneySaved }:any) => {
  return (
    <div className="bg-gray-200 p-6 rounded-lg mt-2 text-center">
      <p className="text-black font-semibold mb-4">{promo?.promoName}</p>
      <p className="text-black font-semibold mb-6">{`Saved ${currencySymbol}${moneySaved} in you current Basket`}</p>
      <button  className="bg-white text-indigo-900 font-semibold py-2 px-4 rounded-md mb-4">
        DISCOUNT APPLIED
      </button>
      
    </div>
  );
};

export default AppliedMembershipCard;