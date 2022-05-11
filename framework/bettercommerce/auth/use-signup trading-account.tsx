import { REGISTER_CUSTOMER_TRADING_ACCOUNT } from '@components/utils/constants'
import fetcher from '../fetcherV2'
import qs from 'qs'
import { Guid } from '@commerce/types';

interface Props {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly companyName: string;
  readonly registeredNumber: string;
  readonly mobileNumber: string;
  readonly phoneNumber: string;
  readonly address1: string;
  readonly address2: string;
  readonly city: string;
  readonly postCode: string;
  readonly country: string;
  readonly cookies?: any
}

export default function useSignupTradingAccount() {
  return async function handler(props: Props) {
    const { firstName, lastName, email, password, companyName, registeredNumber, mobileNumber, phoneNumber, address1, address2, city, postCode, country, cookies, } = props;
    const data = {
      companyId: Guid.empty,
      businessType: "",
      registeredNumber: registeredNumber,
      priceListId: Guid.empty,
      companyUserRole: 0,
      customerGroupId: Guid.empty,
      address: {
        id: 0,
        title: "",
        firstName: firstName,
        lastName: lastName,
        address1: address1,
        address2: "",
        address3: "",
        city: city,
        state: "",
        country: country,
        countryCode: "",
        postCode: postCode,
        phoneNo: phoneNumber,
        mobileNo: mobileNumber,
        companyName: companyName
      },
      username: email,
      firstName: firstName,
      lastName: lastName,
      email: email,
      title: "",
      telephone: phoneNumber,
      mobile: mobileNumber,
      gender: "",
      password: password,
      nickName: "",
      dayOfBirth: "0",
      monthOfBirth: "0",
      yearOfBirth: "0",
      birthDate: "",
      postCode: postCode,
      newsLetterSubscribed: true,
      userSourceType: 1,
      referralType: "Direct",
      userReferrer: "",
      companyName: companyName,
      notifyByEmail: true,
      notifyBySMS: true,
      notifyByPost: true,
      registrationSource: ""
    };

    let response: any = {};

    try {
      /*console.log(JSON.stringify({
        url: `${REGISTER_CUSTOMER_TRADING_ACCOUNT}`,
        method: 'post',
        data,
        cookies,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      }))*/
      response = await fetcher({
        url: `${REGISTER_CUSTOMER_TRADING_ACCOUNT}`,
        method: 'post',
        data,
        cookies,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      });

      //console.log(JSON.stringify(response));

      if (response.statusCode == 200) {
        return response.result;
      }

      return {
        statusCode: response.statusCode,
        message: response?.message,
        messageCode: response?.messageCode,
      };

    } catch (error: any) {
      //console.log(error)
      throw new Error(error.message);
    }
  }
};