// Package Imports
import { v4 as uuid } from "uuid";

// Other Imports
import { decrypt } from "./cipher";
import fetcher from "@framework/fetcher";
import { EmptyGuid, INFRA_LOG_ENDPOINT } from "@components/utils/constants";
import { stringToBoolean, tryParseJson } from "./parse-util";
import { ILogRequestParams } from "@framework/api/operations/log-request";
import { LocalStorage } from "@components/utils/payment-constants";
import { setItem, getItem, removeItem } from '@components/utils/localStorage'

export const isCartAssociated = (cartItems: any) => {
  if (cartItems?.userId && cartItems?.userId !== EmptyGuid) {
    return true;
  }
  return false;
};
export const getCurrentPage = () => {
  if (typeof window !== 'undefined') {
    let currentPage = window.location.href
    if (currentPage.includes('/products')) {
      currentPage = 'PDP'
    } else if (currentPage.includes('/collection')) {
      currentPage = 'PLP'
    } else if (currentPage.includes('/my-account')) {
      currentPage = 'My Account'
    } else {
      currentPage = 'Home'
    }
    return currentPage
  }

  return undefined
}

export const obfuscateHostName = (hostname: string) => {
  if (hostname?.length > 3) {
    return `gandalf${hostname.substring(hostname.length - 3)}`
  }
  return ''
}

export const sanitizeBase64 = (base64: string) => {
  if (base64) {
    return base64?.replace("data:image/png;base64,", "")?.replace("data:image/jpeg;base64,", "");
  }
  return "";
};

export const parsePaymentMethodConfig = (configSettings: any, isSecured: boolean) => {

  if (configSettings?.length) {
    const sandboxUrl = configSettings?.find((x: any) => x?.key === "TestUrl")?.value || "";

    let accountCode = configSettings?.find((x: any) => x?.key === "AccountCode")?.value || "";
    if (isSecured && accountCode) {
      accountCode = decrypt(accountCode);
    }

    let signature = configSettings?.find((x: any) => x?.key === "Signature")?.value || "";
    if (isSecured && signature) {
      signature = decrypt(signature);
    }

    const liveUrl = configSettings?.find((x: any) => x?.key === "ProductionUrl")?.value || "";
    const useSandbox = configSettings?.find((x: any) => x?.key === "UseSandbox")?.value;
    const cancelUrl = configSettings?.find((x: any) => x?.key === "CancelUrl")?.value || "";
    const config = {
      useSandbox: configSettings?.find((x: any) => x?.key === "UseSandbox")?.value,
      accountCode: accountCode,
      signature: signature,
      baseUrl: stringToBoolean(useSandbox) ? sandboxUrl : liveUrl,
      cancelUrl: cancelUrl,
    };
    return config;
  }

  return null;
};

export const getOrderId = (order: any) => {
  return `${order?.orderNo}-${order?.id}`;
};

export const getOrderInfo = () => {
  const orderPayment: any = getItem(LocalStorage.Key.ORDER_PAYMENT) || {};
  const orderResponse: any = getItem(LocalStorage.Key.ORDER_RESPONSE) || {};
  return { order: orderPayment, orderResponse: orderResponse };
};

export const logPaymentRequest = async ({ headers = {}, data = {}, cookies = {}, pageUrl, objectId = "", paymentGatewayId = 0, userId = "", userName = "" }: any, message: string) => {
  const logData: ILogRequestParams = {
    ipAddress: "",
    logLevelId: 20,
    objectId: objectId ?? uuid(),
    pageUrl: pageUrl,
    requestData: JSON.stringify(data),
    shortMessage: message,
    fullMessage: JSON.stringify(headers),
    additionalinfo1: JSON.stringify(cookies),
    paymentGatewayId: paymentGatewayId,
    userId: userId,
    userName: userName,
  };

  const url = `${INFRA_LOG_ENDPOINT}/payment-log`;
  try {
    const logResult: any = await fetcher({
      url,
      data: logData,
      method: 'POST',
      headers: {
        DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
      },
    })
    return logResult
  } catch (error: any) {
    console.log(error, 'err')
    // throw new Error(error.message)
  }
  return null;
};

export const logActivityRequest = async ({ headers = {}, data = {}, cookies = {}, pageUrl, objectId = "", userId = "", userName = "" }: any, message: string) => {
  const logData: ILogRequestParams = {
    ipAddress: "",
    logLevelId: 20,
    objectId: objectId ?? uuid(),
    pageUrl: pageUrl,
    requestData: JSON.stringify(data),
    shortMessage: message,
    fullMessage: JSON.stringify(headers),
    additionalinfo1: JSON.stringify(cookies),
    userId: userId,
    userName: userName,
  };

  const url = `${INFRA_LOG_ENDPOINT}/create`;
  try {
    const logResult: any = await fetcher({
      url,
      data: logData,
      method: 'POST',
      headers: {
        DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
      },
    })
    return logResult
  } catch (error: any) {
    console.log(error, 'err')
    // throw new Error(error.message)
  }
  return null;
};

export const decipherResult = (result: string) => {
  if (result) {
    const deciphered = decrypt(result);
    if (deciphered) {
      const objParsed = tryParseJson(deciphered);
      return objParsed;
    }
  }
  return null;
};