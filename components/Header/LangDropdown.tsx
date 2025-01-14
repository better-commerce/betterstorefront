"use client";

import { Popover, Tab, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { FC, Fragment, useCallback, useMemo } from "react";
import { useTranslation as useTranslationText } from "@commerce/utils/use-translation";
import Link from "next/link";
import Cookies from "js-cookie";
import { Cookie } from "@framework/utils/constants";
import { useRouter } from "next/router";
import { getCurrency } from '@framework/utils/app-util'
import { EmptyString } from "@components/utils/constants";

interface LangDropdownProps {
  readonly currencies: Array<any>;
  readonly languages: Array<any>;
  readonly panelClassName?: string;
  readonly defaultLanguage?: string;
  readonly defaultCountry?: string;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const Languages = ({ close, defaultLanguage, defaultCountry, languages }: any) => {
  const router = useRouter()
  const getLocaleUrl = useMemo(() => {
    return (language: any) => {
      const defaultCulture = `${defaultLanguage}-${defaultCountry}`
      const url = (language?.languageCulture === defaultCulture) ? router.asPath : `/${language?.languageCulture}${router.asPath}`
      return url
    }
  }, [defaultLanguage, defaultCountry, router.asPath])
  const isActiveLocale = useMemo(() => (language: any) => language?.languageCulture === router?.locale, [router?.locale])
  return (
    <div className="grid grid-cols-3 gap-6">
      {languages?.map((language: any, index: number) => (
        <Link key={index} legacyBehavior href={getLocaleUrl(language)} locale={language?.languageCulture}>
          <a key={index} href={getLocaleUrl(language)} onClick={() => {
            Cookies.set(Cookie.Key.LANGUAGE, language?.languageCulture)
            Cookies.set(Cookie.Key.COUNTRY, language?.languageCulture?.substring(3))
            close();
          }} className={`flex items-center mb-1 px-2 pb-2 pt-0.5 -m-3 transition border duration-150 ease-in-out rounded-lg hover:bg-sky-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 ${isActiveLocale(language) ? "bg-sky-100 dark:bg-gray-700 border-sky-300" : "bg-transparent border-white"}`}
          >
            <div className="flex items-center justify-start gap-1 text-sm font-medium text-black dark:text-gray-400">
              <span className={`sprite-flag flag-${language?.languageCode?.toLowerCase()}`}></span>
              <span className="relative text-[13px] font-normal top-1">{language?.name}</span>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
};

const LangDropdown: FC<LangDropdownProps> = ({ currencies = [], languages = [], panelClassName = "", defaultLanguage = "", defaultCountry = "" }) => {
  const router = useRouter()
  const translateText = useTranslationText()
  const isActiveCurrency = useMemo(() => (currencyCode: any) => getCurrency() === currencyCode, [])
  const onSelectCurrency = useCallback(({ currency, close }: any) => {
    if (isActiveCurrency(currency?.currencyCode)) return close()
    Cookies.set(Cookie.Key.CURRENCY, currency?.currencyCode)
    Cookies.set(Cookie.Key.CURRENT_CURRENCY, currency?.currencyCode)
    Cookies.set(Cookie.Key.CURRENCY_SYMBOL, currency?.currencySymbol)
    close()
    router.reload()
  }, [router])

  const activeCurrencyName = useMemo(() => currencies?.find((currency: any) => currency?.currencyCode === getCurrency())?.currencyCode || EmptyString, [router])
  const activeLanguageName = useMemo(() => languages?.find((language: any) => language?.languageCulture === router?.locale)?.languageCode || EmptyString, [router?.locale])

  const Currencies = ({ close }: any) => {
    return (
      <div className="grid grid-cols-2 gap-7">
        {currencies?.map((currency, index) => {
          return (
            <a key={currency?.currencyCode} href="#" onClick={() => onSelectCurrency({ currency, close })} className={`flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-sky-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 border focus-visible:ring-opacity-50 ${currency?.currencyCode ? " dark:bg-gray-700" : "opacity-80"} ${isActiveCurrency(currency?.currencyCode) ? 'bg-sky-100 dark:bg-gray-700 border-sky-300 cursor-not-allowed select-none' : 'border-white'} `}>
              <>
                <div className="flex items-center justify-start gap-1">
                  <span className='flex items-center justify-center text-[16px] font-semibold text-black'>{currency?.currencySymbol}</span>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{currency?.currencyCode}</p>
                  </div>
                </div>
              </>
            </a>
          )
        })}
      </div>
    );
  };

  return (
    <div className="flex LangDropdown justify-normal">
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button className={` ${open ? "" : "text-opacity-80"} group h-10 sm:h-12 px-3 py-1.5 inline-flex items-center text-sm dark:text-neutral-200 font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}>
              <span className="hidden ml-2 font-semibold text-black md:block">{activeCurrencyName}</span>
            </Popover.Button>
            <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1" >
              <Popover.Panel className={`absolute z-20 w-96 mt-3.5 lang-width right-0 ${panelClassName}`} >
                <div className="p-3 bg-white shadow-lg sm:p-6 rounded-2xl dark:bg-neutral-800 ring-1 ring-black ring-opacity-5">
                  <h3 className="text-lg font-semibold text-black mb-7">Select your Currency</h3>
                  <Currencies close={close} />
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button className={` ${open ? "" : "text-opacity-80"} group h-10 sm:h-12 px-3 py-1.5 inline-flex items-center text-sm text-gray-800 dark:text-neutral-200 font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`} >
              <span className="hidden ml-2 md:block"><span className={`sprite-flag flag-${activeLanguageName?.toLowerCase()}`}></span></span>
            </Popover.Button>
            <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1" >
              <Popover.Panel className={`absolute z-20 w-[600px] mt-3.5 lang-width right-0 ${panelClassName}`} >
                <div className="p-3 bg-white shadow-lg sm:p-6 rounded-2xl dark:bg-neutral-800 ring-1 ring-black ring-opacity-5">
                  <h3 className="mb-6 text-lg font-semibold text-black">Select your language</h3>
                  <Languages close={close} defaultLanguage={defaultLanguage} defaultCountry={defaultCountry} languages={languages} />
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};
export default LangDropdown;