import { useSignupTradingAccount } from '@framework/auth'

export default async function (req: any, res: any) {
  const {
    title,
    firstName,
    lastName,
    email,
    password,
    companyName,
    registeredNumber,
    mobileNumber,
    phoneNumber,
    address1,
    address2,
    address3,
    city,
    postCode,
    state,
    country,
    countryCode,
  }: any = req.body.data
  try {
    const response = await useSignupTradingAccount()({
      title: title,
      address1: address1,
      address2: address2,
      address3: address3,
      city: city,
      state: state,
      country: country,
      countryCode: countryCode,
      postCode: postCode,
      registeredNumber: registeredNumber,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
      mobileNumber: mobileNumber,
      companyName: companyName,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error: any) {
    console.log(error)
    throw new Error(error)
  }
}
