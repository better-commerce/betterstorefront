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
    <div className="grid gap-8 grid-cols-2">
      {languages?.map((language: any, index: number) => (
        <Link key={index} legacyBehavior href={getLocaleUrl(language)} locale={language?.languageCulture}>
          <a key={index} href={getLocaleUrl(language)} onClick={() => {
            Cookies.set(Cookie.Key.LANGUAGE, language?.languageCulture)
            Cookies.set(Cookie.Key.COUNTRY, language?.languageCulture?.substring(3))
            close();
          }} className={`flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 ${isActiveLocale(language) ? "bg-gray-200 dark:bg-gray-700" : "bg-white"}`}
          >
            <div className="">
              <p className="text-sm font-medium text-black dark:text-gray-400">{language?.name}</p>
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

  const Currencies = ({ close }: any) => {
    return (
      <div className="grid gap-7 grid-cols-2">
        {currencies?.map((currency, index) => {
          return (
            <a key={currency?.currencyCode} href="#" onClick={() => onSelectCurrency({ currency, close })} className={`flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 ${currency?.currencyCode ? " dark:bg-gray-700" : "opacity-80"} ${isActiveCurrency(currency?.currencyCode) ? 'bg-gray-100 cursor-not-allowed select-none' : ''} `}>
              <>
                <span className='border-[1px] border-gray-600 w-5 h-5 flex items-center justify-center text-xs rounded-full'>{currency?.currencySymbol}</span>
                <p className="ml-2 text-sm font-medium "> {currency?.currencyCode}</p>
              </>
            </a>
          )
        })}
      </div>
    );
  };

  return (
    <div className="LangDropdown">
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button className={` ${open ? "" : "text-opacity-80"} group h-10 sm:h-12 px-3 py-1.5 inline-flex items-center text-sm text-gray-800 dark:text-neutral-200 font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`} >
              <GlobeAltIcon className="glob-icon-height w-[18px] h-[18px] opacity-80" />
              <span className="ml-2 hidden md:block">{translateText('common.label.languageText')}</span>
              <ChevronDownIcon className={`${open ? "-rotate-180" : "text-opacity-70"} ml-1 h-4 w-4  group-hover:text-opacity-80 transition ease-in-out duration-150`} aria-hidden="true" />
            </Popover.Button>
            <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1" >
              <Popover.Panel className={`absolute z-20 w-96 mt-3.5 lang-width right-0 ${panelClassName}`} >
                <div className="p-3 sm:p-6 bg-white shadow-lg rounded-2xl dark:bg-neutral-800 ring-1 ring-black ring-opacity-5">
                  <Tab.Group>
                    <Tab.List className="flex p-1 space-x-1 bg-gray-100 rounded-full dark:bg-slate-700">
                      {[translateText('common.label.languageText'), translateText('label.navBar.currencyText')].map((category) => (
                        <Tab key={category} className={({ selected }) => classNames("w-full rounded-full py-2 text-sm font-medium leading-5 text-gray-700", "focus:outline-none focus:ring-0", selected ? "bg-white shadow" : "text-gray-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-900/40")} >
                          {category}
                        </Tab>
                      ))}
                    </Tab.List>
                    <Tab.Panels className="mt-5">
                      <Tab.Panel className={classNames("rounded-xl p-3", "focus:outline-none focus:ring-0")} >
                        <Languages close={close} defaultLanguage={defaultLanguage} defaultCountry={defaultCountry} languages={languages} />
                      </Tab.Panel>
                      <Tab.Panel className={classNames("rounded-xl p-3", "focus:outline-none focus:ring-0")} >
                        <Currencies close={close} />
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
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