import {
  GENERAL_EMAIL_ADDRESS,
  BTN_SIGN_UP,
  SIGN_UP_FOR_NEWSLETTER,
  SIGN_UP_TEXT,
} from '@components/utils/textVariables'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { NEXT_SUBSCRIBE, Messages } from '@components/utils/constants'
import { useUI } from '@components/ui'
export default function Newsletter() {
  const [value, setValue] = useState('')
  const [err, setErr] = useState<any>(null)
  const { setAlert } = useUI()
  const handleChange = (e: any) => {
    setValue(e.target.value)
  }
  const submitSubscription = async (data: any) => {
    const regex = Messages.Validations.RegularExpressions.EMAIL
    if (regex.test(data.toString())) {
      await axios.post(NEXT_SUBSCRIBE, {
        email: data,
        notifyByEmail: true,
      })
      setValue('')
      setAlert({
        type: 'success',
        msg: 'Email Registered Successfully for Newsletter',
      })
    } else setErr('Enter a valid email')
  }

  useEffect(() => {
    if (err) setTimeout(() => setErr(null), 3000)
  }, [err])

  return (
    <>
      {/* footer newsletter start */}
      <h4 className="my-4 font-bold text-black uppercase sm:my-0 text-footer-clr ">
        {SIGN_UP_FOR_NEWSLETTER}
      </h4>
      <p className="mt-1 text-gray-900 text-md text-footer-clr ">
        {SIGN_UP_TEXT}
      </p>
      <form
        className="flex mt-6 sm:max-w-md"
        onSubmit={(e) => {
          e.preventDefault()
          submitSubscription(value)
        }}
      >
        <label htmlFor="email-address" className="sr-only">
          {GENERAL_EMAIL_ADDRESS}
        </label>
        <input
          id="email-address"
          type="text"
          name={'email-address'}
          placeholder="Enter Email ID"
          value={value}
          onChange={handleChange}
          className="w-full min-w-0 px-4 py-2 text-gray-900 placeholder-gray-600 bg-white border border-gray-300 rounded-sm shadow-sm appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
        <div className="flex-shrink-0 ml-4">
          <button
            type="submit"
            className="flex items-center justify-center w-full h-full px-6 py-2 font-medium uppercase btn-secondary border-footer-btn"
          >
            {BTN_SIGN_UP}
          </button>
        </div>
      </form>
      {err ? <p className="text-red-500 text-sm mt-2">{err}</p> : null}
      {/* footer newsletter start */}
    </>
  )
}
