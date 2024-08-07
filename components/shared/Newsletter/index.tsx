import { useEffect, useState } from 'react'
import axios from 'axios'
import { NEXT_SUBSCRIBE, Messages } from '@components/utils/constants'
import { useUI } from '@components/ui'
import { useTranslation } from '@commerce/utils/use-translation'
import { Guid } from '@commerce/types'
export default function Newsletter() {
  const translate = useTranslation()
  const [value, setValue] = useState('')
  const [err, setErr] = useState<any>(null)
  const { setAlert, user, setUser, isGuestUser } = useUI()
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
      // if loggedIn user
      if(!isGuestUser && user?.userId && user?.id != Guid.empty){
        setUser({ ...user, notifyByEmail: true })
      }
      setValue('')
      setAlert({
        type: 'success',
        msg: translate('label.newsLetter.successText'),
      })
    } else setErr(translate('common.message.validEmailErrorMsg'))
  }

  useEffect(() => {
    if (err) setTimeout(() => setErr(null), 3000)
  }, [err])

  return (
    <>
      <div className='flex w-full py-4 bg-gray-100 border sm:py-6 border-top'>
        <div className='container mx-auto'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between'>
            <div className='flex flex-col'>
              <h4 className="my-4 text-xl font-semibold text-black uppercase sm:text-2xl sm:my-0 text-footer-clr ">
                {translate('label.newsLetter.signupText')}
              </h4>
              <p className="sm:mt-1 text-sm text-gray-600 text-footer-clr ">
                {translate('label.newsLetter.signupTitle')}
              </p>
            </div>
            <div className='sm:min-w-[50%] min-w-full mt-5 sm:mt-0'>
              <form className="flex sm:w-full" onSubmit={(e) => { e.preventDefault(); submitSubscription(value); }} >
                <label htmlFor="email-address" className="sr-only"> {translate('label.newsLetter.emailLabelText')} </label>
                <input id="email-address" type="text" name={'email-address'} placeholder={translate('common.message.enterEmailText')} value={value} onChange={handleChange} className="w-full min-w-0 px-4 py-2 text-gray-900 placeholder-gray-600 bg-white border border-gray-300 dark:border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                <div className="flex-shrink-0 ml-4">
                  <button type="submit" className="flex items-center justify-center w-full h-full btn btn-secondary border-footer-btn" >
                    {translate('label.newsLetter.signupBtnTitle')}
                  </button>
                </div>
              </form>
              {err ? <p className="mt-2 text-sm text-red-500">{err}</p> : null}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
