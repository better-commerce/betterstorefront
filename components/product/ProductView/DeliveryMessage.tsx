// Base Imports
import React from 'react'

// Package Imports

// Component Imports

// Other Imports

function DeliveryMessage(product: any) {
  return (
    <>
      {product?.flags?.isFreeDelivery && (
        <div className="mb-2 font-bold text-primary text-20">Free Delivery</div>
      )}
      {product?.deliveryMessage && (
        <p className="font-normal text-14 text-brown-light">
          {product?.deliveryMessage}{' '}
          {/* For orders above ₹600, Usually delivered in 2-5 days */}
        </p>
      )}
    </>
  )
}

export default DeliveryMessage
