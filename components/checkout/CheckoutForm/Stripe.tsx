import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import getStripe from '@components/utils/get-stripe'
import { useState } from 'react'

function CheckoutForm({ callback }: any) {
  const [errors, setErrors] = useState(null)
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async () => {
    // Block native form submission.
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const card = elements.getElement(CardElement)

    if (card == null) {
      return
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod }: any = await stripe.createPaymentMethod({
      type: 'card',
      card,
    })

    if (error) {
      setErrors(error.message)
    } else {
      callback()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      {errors && <span className="text-red-400">{errors}</span>}
      <div className="flex justify-center items-center py-4">
        <button
          className={`text-white max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:bg-indigo-600 sm:w-full`}
          type="button"
          disabled={!stripe}
          onClick={handleSubmit}
        >
          Pay
        </button>
      </div>
    </form>
  )
}

export default function StripeWrapper({ callback = () => {} }) {
  const stripePromise = getStripe()

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm callback={callback} />
    </Elements>
  )
}
