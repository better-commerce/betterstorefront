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


export const setNativeValue = (element: any, value: string) => {
  if (element) {
    const valueSetter: any = Object.getOwnPropertyDescriptor(element, 'value')?.set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter: any = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

    if (valueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else {
      valueSetter.call(element, value);
    }
  }
}

export const triggerKeyPress = (element: any) => {
  if (element) {
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }
}