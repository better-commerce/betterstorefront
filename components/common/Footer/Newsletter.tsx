import { useEffect, useState } from 'react'
import axios from 'axios'
import { NEXT_SUBSCRIBE, Messages } from '@components/utils/constants'
import { useUI } from '@components/ui'
import { useTranslation } from '@commerce/utils/use-translation'
export default function Newsletter() {
  const translate = useTranslation()
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
        msg: translate('label.newsLetter.successText'),
      })
    } else setErr(translate('message.validEmailErrorMsg'))
  }

  useEffect(() => {
    if (err) setTimeout(() => setErr(null), 3000)
  }, [err])

  return (
    <>
      {/* footer newsletter start */}
      <h4 className="my-4 font-bold text-black uppercase sm:my-0 text-footer-clr ">
        {translate('label.newsLetter.signupText')}
      </h4>
      <p className="mt-1 text-gray-900 text-md text-footer-clr ">
        {translate('label.newsLetter.signupTitle')}
      </p>
      <form
        className="flex mt-6 sm:max-w-md"
        onSubmit={(e) => {
          e.preventDefault()
          submitSubscription(value)
        }}
      >
        <label htmlFor="email-address" className="sr-only">
          {translate('label.newsLetter.emailLabelText')}
        </label>
        <input
          id="email-address"
          type="text"
          name={'email-address'}
          placeholder={translate('message.enterEmailText')}
          value={value}
          onChange={handleChange}
          className="w-full min-w-0 px-4 py-2 text-gray-900 placeholder-gray-600 bg-white border border-gray-300 rounded-sm shadow-sm appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
        <div className="flex-shrink-0 ml-4">
          <button
            type="submit"
            className="flex items-center justify-center w-full h-full btn btn-secondary border-footer-btn"
          >
            {translate('label.newsLetter.signupBtnTitle')}
          </button>
        </div>
      </form>
      {err ? <p className="text-red-500 text-sm mt-2">{err}</p> : null}
      {/* footer newsletter start */}
    </>
  )
}
