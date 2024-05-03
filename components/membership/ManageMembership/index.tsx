
const ManageMembership = ({
  defaultDisplayMembership,
  allMembershipPlans,
}: any) => {
  const membershipPlan = allMembershipPlans?.sort(
    (a: any, b: any) => a?.displayOrder - b?.displayOrder
  )
  const currentDate = new Date();
  const formattedCurrentDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-8">
      <h2 className="text-2xl font-bold mb-4"> Upgrade your membership today! </h2>
      <p className="text-gray-600 mb-6">
        Get more {defaultDisplayMembership?.membershipPromoDiscountPerc}% off
        vouchers to use up to your next billing date
      </p>

      <div className="grid grid-cols-1 gap-4 w-full max-w-md">
        {membershipPlan?.map((membershipPlan: any) => (
          <div key={membershipPlan?.recordId} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2"> {membershipPlan?.name} </h3>
            <p className="text-gray-600 mb-2">{membershipPlan?.noOfVouchers} X 20% discounts anytime</p>
            <p className="text-gray-800 font-bold">{membershipPlan?.price?.formatted?.withTax } per year</p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded mt-2">
              Upgrade from {formattedCurrentDate} until next billing date
            </button>
          </div>
        ))}
      </div>

      {defaultDisplayMembership?.membershipPromoDiscountPerc > 0 && (
        <div className="text-gray-600 mt-6">
          <p>
            When upgrading your My BetterStore membership plan, you are paying
            the difference from your original plan to the plan you choose to
            upgrade to.
          </p>
          <p className="mt-2">
            You will retain all your existing member benefits and add additional{' '}
            {defaultDisplayMembership?.membershipPromoDiscountPerc}% off
            vouchers until your next billing date.
          </p>
          <p className="mt-2">
            Remember, upgrading your membership does not extend your next
            billing date, so please check you have adequate time left to use
            your extra vouchers and make the most of your membership!
          </p>
          <p className="mt-2">
            You can also purchase a brand new{' '}
            {membershipPlan?.[membershipPlan?.length - 1]?.name}, giving you
            unlimited {defaultDisplayMembership?.membershipPromoDiscountPerc}%
            off plus all your existing member perks for the next 12 months.
          </p>
        </div>
      )}
    </div>
  )
}

export default ManageMembership
