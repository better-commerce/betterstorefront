import { EmptyGuid } from "@components/utils/constants";

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