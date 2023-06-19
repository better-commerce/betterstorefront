// Base Imports
import React from 'react'

// Package Imports

// Component Imports

// Other Imports

function DeliveryMessage({ product, freeShippingOverXValue }: any) {
  return (
    <div className="flex flex-col px-4 pt-0 pb-0 mt-0 sm:pb-6 sm:pt-2 sm:mt-2 sm:px-0">
      <div className="mb-2 font-bold text-primary text-20">Free Delivery</div>
      {freeShippingOverXValue && (
        <p className="font-normal text-14 text-brown-light">
          For orders above ₹{freeShippingOverXValue}, Usually delivered in 2-5
          days
        </p>
      )}
    </div>
  )
}

export default DeliveryMessage
