import React from 'react';
import moment from 'moment';

const MembershipDetails = ({ membership }: any) => {
    const formatDate = (dateString: string) => {
        return moment(dateString).format('MMMM Do YYYY, h:mm:ss a');
    };

  return (
    <div className="bg-gray-700 text-white py-4 px-6 rounded-md shadow-md my-4">
      <div>
        <p className="text-lg font-semibold">Current Plan: {membership?.membershipName}</p>
      </div>
      <div className="mt-2">
        <span>Your next billing date will be : </span>
        <span>{formatDate(membership?.endDate)}</span>
      </div>
      <div className="mt-2">
        <span>You've been a member since : </span>
        <span className="text-sm">{formatDate(membership?.startDate)}</span>
      </div>
    </div>
  );
};

export default MembershipDetails;
