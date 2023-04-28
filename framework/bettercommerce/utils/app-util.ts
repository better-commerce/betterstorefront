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
