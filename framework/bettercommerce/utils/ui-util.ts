export const showElement = (elem: any) => {
  if (elem) {
    elem.style.display = 'block'
    return true
  }
  return false
}

export const hideElement = (elem: any) => {
  if (elem) {
    elem.style.display = 'none'
    return true
  }
  return false
}

export const showSelectedElement = (elemSelector: string) => {
  if (elemSelector) {
    const elem: any = document.querySelector(elemSelector)
    if (elem) {
      elem.style.display = 'block'
      return true
    }
  }
  return false
}

export const hideSelectedElement = (elemSelector: string) => {
  if (elemSelector) {
    const elem: any = document.querySelector(elemSelector)
    if (elem) {
      elem.style.display = 'none'
      return true
    }
  }
  return false
}
