import { REGISTER_CUSTOMER_TRADING_ACCOUNT } from '@components/utils/constants'
import fetcher from '../fetcherV2'
import qs from 'qs'
import { Guid } from '@commerce/types';

interface Props {
  readonly title: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly address1: string;
  readonly address2: string;
  readonly address3: string;
  readonly password: string;
  readonly companyName: string;
  readonly registeredNumber: string;
  readonly mobileNumber: string;
  readonly phoneNumber: string;
  readonly city: string;
  readonly postCode: string;
  readonly state: string;
  readonly countryCode: string;
  readonly country: string;
  readonly cookies?: any;
}

export default function useSignupTradingAccount() {
  return async function handler(props: Props) {
    const { title, firstName, lastName, email, password, companyName, registeredNumber, mobileNumber, phoneNumber, address1, address2, address3, city, postCode, state, countryCode, country, cookies, } = props;
    const data = {
      companyId: Guid.empty,
      businessType: "",
      registeredNumber: registeredNumber,
      priceListId: Guid.empty,
      companyUserRole: 0,
      customerGroupId: Guid.empty,
      address: {
        title: title,
        firstName: firstName,
        lastName: lastName,
        address1: address1,
        address2: address2,
        address3: address3,
        city: city,
        state: state,
        country: country,
        countryCode: countryCode,
        postCode: postCode,
        //phoneNo: phoneNumber,
        //mobileNo: mobileNumber,
        companyName: companyName
      },
      username: email,
      firstName: firstName,
      lastName: lastName,
      email: email,
      title: "",
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
      response = await fetcher({
        url: `${REGISTER_CUSTOMER_TRADING_ACCOUNT}`,
        method: 'post',
        data,
        cookies,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      });
      //console.log(response.result);
      return response.result;

    } catch (error: any) {
      //console.log(error)
      throw new Error(error.message);
    }
  }
};