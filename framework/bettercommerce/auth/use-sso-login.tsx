import { AUTHENTICATE_CUSTOMER } from '@components/utils/constants'
import fetcher from '../fetcher'
import qs from 'qs'

interface Props {
  email: string
  cookies?: any
  password: string
}

export default function useSSOLogin() {
  return async function handler({ email, password, cookies }: Props) {
    const data = {
      username: email,
      password,
    }

    try {
      /*const response: any = await fetcher({
        url: `${AUTHENTICATE_CUSTOMER}`,
        method: 'post',
        data,
        cookies,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return response.result*/

      return {
        userId: 'd4a66bfa-b915-ee11-b1c3-000d3a211cf7',
        username: 'gagandeep.singh@bettercommerce.io',
        firstName: 'Gagandeep',
        lastName: 'Singh',
        email: 'gagandeep.singh@bettercommerce.io',
        title: null,
        telephone: null,
        mobile: null,
        gender: null,
        nickName: null,
        dayOfBirth: '0',
        monthOfBirth: '0',
        yearOfBirth: '0',
        birthDate: null,
        postCode: null,
        newsLetterSubscribed: false,
        userSourceType: 0,
        referralType: 'Direct',
        userReferrer: null,
        address: {
          id: 0,
          title: null,
          firstName: null,
          lastName: null,
          address1: null,
          address2: null,
          address3: null,
          city: null,
          state: null,
          country: null,
          countryCode: null,
          postCode: null,
          phoneNo: null,
          mobileNo: null,
          companyName: null,
          label: null,
          isConsentSelected: false,
        },
        companyId: '00000000-0000-0000-0000-000000000000',
        companyName: null,
        businessType: null,
        registeredNumber: null,
        priceListId: '00000000-0000-0000-0000-000000000000',
        companyUserRole: 0,
        isRegistered: true,
        notifyByEmail: false,
        notifyBySMS: false,
        notifyByPost: false,
        sourceProcess: null,
        isWelcomeEmailSent: false,
        isPromptPasswordChange: false,
        isForcePasswordChange: false,
        isCreatedByAdmin: false,
        isConvertCompanyRequest: false,
        hasSubscription: false,
        hasMembership: false,
        externalAccountingId: null,
        registrationSource: null,
        hasSubscribed: false,
        customerGroupId: '00000000-0000-0000-0000-000000000000',
        urlReferrer: null,
        sourceSection: null,
        notifyByWhatsapp: false,
        defaultPaymentGatewayId: 0,
        defaultPaymentMethod: null,
        pspInformation: null,
        defaultPaymentIdentifier: null,
        securityStamp: '00000000-0000-0000-0000-000000000000',
        isAssociated: false,
      }
    } catch (error: any) {
      console.log(error)
      throw new Error(error.message)
    }
  }
}
