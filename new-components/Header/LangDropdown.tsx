"use client";

import { Popover, Tab, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { FC, Fragment } from "react";
import { headerCurrency } from "./CurrencyDropdown";
import { useTranslation as useTranslationText } from "@commerce/utils/use-translation";
import Link from "next/link";
import Cookies from "js-cookie";
import { Cookie } from "@framework/utils/constants";
import { useRouter } from "next/router";

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

const LangDropdown: FC<LangDropdownProps> = ({ currencies = [], languages = [], panelClassName = "", defaultLanguage = "", defaultCountry = "" }) => {
  const router = useRouter()
  const translateText = useTranslationText()

  const Languages = ({ close }: any) => {
    const defaultCulture = `${defaultLanguage}-${defaultCountry}`
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        {languages?.map((language, index) => (
          <Link legacyBehavior href={(language?.languageCulture === defaultCulture) ? "/" : language?.languageCulture} locale={language?.languageCulture}>
            <a key={index} href="#" onClick={() => {
              Cookies.set(Cookie.Key.LANGUAGE, language?.languageCode)
              close();
            }} className={`flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 ${true ? "bg-gray-100 dark:bg-gray-700" : "opacity-80"}`}
            >
              <div className="">
                {/*<p className="text-sm font-medium ">{language?.countryName}</p>*/}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {language?.name}
                </p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    );
  };

  const Currencies = ({ close }: any) => {
    return (
      <div className="grid gap-7 lg:grid-cols-2">
        {currencies?.map((currency, index) => {
          const item = headerCurrency(currency?.currencyCode)
          return (
            <a key={currency?.currencyCode} href="#" onClick={() => {
              Cookies.set(Cookie.Key.CURRENCY, currency?.currencyCode)
              Cookies.set(Cookie.Key.CURRENT_CURRENCY, currency?.currencyCode)
              close();
              router.reload()
            }}
              className={`flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 ${true ? "bg-gray-100 dark:bg-gray-700" : "opacity-80"}`}
            >
              <>
                <item.icon className="w-[18px] h-[18px] " />
                <p className="ml-2 text-sm font-medium ">{item.name}</p>
              </>
            </a>
          )
        })}
      </div>
    );
  };

  return (
    <div className="hidden LangDropdown md:block">
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`
                ${open ? "" : "text-opacity-80"}
             group h-10 sm:h-12 px-3 py-1.5 inline-flex items-center text-sm text-gray-800 dark:text-neutral-200 font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <GlobeAltIcon className="w-[18px] h-[18px] opacity-80" />
              <span className="ml-2">{translateText('common.label.languageText')}</span>
              <ChevronDownIcon
                className={`${open ? "-rotate-180" : "text-opacity-70"}
                  ml-1 h-4 w-4  group-hover:text-opacity-80 transition ease-in-out duration-150`}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                className={`absolute z-20 w-96 mt-3.5 right-0 ${panelClassName}`}
              >
                <div className="p-6 bg-white shadow-lg rounded-2xl dark:bg-neutral-800 ring-1 ring-black ring-opacity-5">
                  <Tab.Group>
                    <Tab.List className="flex p-1 space-x-1 bg-gray-100 rounded-full dark:bg-slate-700">
                      {["Language", "Currency"].map((category) => (
                        <Tab
                          key={category}
                          className={({ selected }) =>
                            classNames(
                              "w-full rounded-full py-2 text-sm font-medium leading-5 text-gray-700",
                              "focus:outline-none focus:ring-0",
                              selected
                                ? "bg-white shadow"
                                : "text-gray-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-900/40"
                            )
                          }
                        >
                          {category}
                        </Tab>
                      ))}
                    </Tab.List>
                    <Tab.Panels className="mt-5">
                      <Tab.Panel
                        className={classNames(
                          "rounded-xl p-3",
                          "focus:outline-none focus:ring-0"
                        )}
                      >
                        <Languages close={close} />
                      </Tab.Panel>
                      <Tab.Panel
                        className={classNames(
                          "rounded-xl p-3",
                          "focus:outline-none focus:ring-0"
                        )}
                      >
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
