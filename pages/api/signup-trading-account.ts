import { useSignupTradingAccount } from '@framework/auth'
export default async (req: any, res: any) => {
  const { firstName, lastName, email, password, companyName, registeredNumber, mobileNumber, phoneNumber, address1, address2, city, postCode, country }: any = req.body.data
  try {
    const response = await useSignupTradingAccount()({
      registeredNumber: registeredNumber,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      address1: address1,
      address2: address2,
      city: city,
      country: country,
      postCode: postCode,
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
