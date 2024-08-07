import axios from 'axios'
import { NEXT_UPDATE_DETAILS, NEXT_SUBSCRIBE, } from '@components/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'
import { useUI } from '@components/ui'

const handleError = (setTitle: any) => {
  const translate = useTranslation()
  setTitle(translate('label.addressBook.updateFailedText'))
  window.scrollTo(0, 0)
}

export const URLS = {
  subscribe: NEXT_SUBSCRIBE,
  updateDetails: NEXT_UPDATE_DETAILS,
}

export const useHandleSubmit = () => {
  const { setAlert } = useUI();
  const translate = useTranslation();
  const handleSubmit = async (  
    values: any,
    user: any,
    setUser: any,
    setTitle: any,
    url: string = URLS.updateDetails) => {
    try {
      const response = await axios.post(url, {
        ...user,
        ...values,
      })
      if (response) {
        setUser({ ...user, ...values })
        setAlert({type:'success',msg: translate('label.addressBook.detailsUpdatedText')})
        setTitle(translate('label.addressBook.detailsUpdatedText'))
        window.scrollTo(0, 0)
      } else {
        handleError(setTitle)
      }
    } catch (error) {
      handleError(setTitle)
    }
  }
  return handleSubmit;
}
