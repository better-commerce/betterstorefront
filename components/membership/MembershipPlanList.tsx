import React from 'react';

interface Plan {
  recordId: string;
  name: string;
  noOfVouchers: any;
  price: {
    formatted: {
      withTax: string;
    };
  };
}

interface MembershipPlanListProps {
  membershipPlans: Plan[];
  defaultDisplayMembership: {
    membershipPromoDiscountPerc: number;
  };
  selectedPlan: Plan | null;
  handlePlanSelection: (plan: Plan) => void;
}

const MembershipPlanList: React.FC<MembershipPlanListProps> = ({ membershipPlans, defaultDisplayMembership, selectedPlan, handlePlanSelection }) => {
  console.log("selection",selectedPlan)
  return (
    <div className="grid grid-cols-1 gap-4 mb-4">
      {membershipPlans?.map((plan) => (
        <div key={plan.recordId} className="flex items-center bg-gray-100 p-2 rounded" onClick={() => handlePlanSelection(plan)}>
          <input
            id={`plan-${plan.recordId}`}
            type="radio"
            name="plan"
            value={plan.recordId}
            checked={selectedPlan?.recordId === plan.recordId}
            onChange={() => handlePlanSelection(plan)}
            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
          />
          <label htmlFor={`plan-${plan.recordId}`} className="ml-3 block text-sm font-medium text-gray-700">
            <h4 className="text-lg font-semibold mb-2">{plan?.name}</h4>
            <p className="text-gray-600 mb-2">{`${plan?.noOfVouchers} x ${defaultDisplayMembership?.membershipPromoDiscountPerc}% discounts anytime`}</p>
            <p className="text-gray-800 font-bold">{`${plan?.price?.formatted?.withTax} per year`}</p>
          </label>
        </div>
      ))}
    </div>
  );
};

export default MembershipPlanList;
