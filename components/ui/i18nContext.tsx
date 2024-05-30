// context/i18nContext.js
import { createContext, useContext } from 'react';

const I18nContext = createContext(null);

export const I18nProvider = ({ value, children }: any) => {
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);
