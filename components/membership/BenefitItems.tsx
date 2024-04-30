import React from 'react'

const BenefitItems = ({ defaultDisplayMembership }:any) => {
  const benefitItems = [
    {
      icon: (
        <svg
          className="h-12 w-12 text-gray-500 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 16l7.07-16.97 7.9 16.97H3zm7-15l-5 13h11l-6-13z"
          />
        </svg>
      ),
      description: "Unlimited FREE* delivery",
    },
    {
      icon: (
        <svg
          className="h-12 w-12 text-gray-500 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      description: "Member-only offers and sales",
    },
  ];

  if (defaultDisplayMembership?.membershipPromoDiscountPerc) {
    benefitItems.push({
      icon: (
        <svg
          className="h-12 w-12 text-gray-500 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          />
        </svg>
      ),
      description: `${defaultDisplayMembership?.membershipPromoDiscountPerc}% off whenever you want*`,
    });
  }

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {benefitItems.map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          {item.icon}
          <p className="text-sm text-gray-500 text-center">{item?.description}</p>
        </div>
      ))}
    </div>
  );
};

export default BenefitItems