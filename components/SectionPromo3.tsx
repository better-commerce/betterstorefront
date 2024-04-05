import React, { FC } from "react";
import backgroundLineSvg from "images/BackgroundLine.svg";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Input from "./shared/Input/Input";
import ButtonCircle from "./shared/Button/ButtonCircle";
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useUI } from '@components/ui'
import { useTranslation } from "@commerce/utils/use-translation";
import { NEXT_SUBSCRIBE, Messages } from '@components/utils/constants'
import { IMG_PLACEHOLDER } from "./utils/textVariables";
import { generateUri } from "@commerce/utils/uri-util";
export interface SectionPromo3Props {
  className?: string;
  data?: any;
}

const SectionPromo3: FC<SectionPromo3Props> = ({ className = "lg:pt-10", data }) => {
  const translate = useTranslation()
  const [value, setValue] = useState('')
  const [err, setErr] = useState<any>(null)
  const { setAlert } = useUI()
  const handleChange = (e: any) => {
    setValue(e.target.value)
  }
  const submitSubscription = async (data: any) => {
    const regex = Messages.Validations.RegularExpressions.EMAIL
    if (regex.test(data.toString())) {
      await axios.post(NEXT_SUBSCRIBE, {
        email: data,
        notifyByEmail: true,
      })
      setValue('')
      setAlert({
        type: 'SUCCESS',
        msg: 'Email Registered Successfully for Newsletter',
      })
    } else setErr('Enter a valid email')
  }

  useEffect(() => {
    if (err) setTimeout(() => setErr(null), 3000)
  }, [err])

  return (
    <div className={`nc-SectionPromo3 ${className}`}>
      {data?.map((subs: any, subsIdx: number) => (
        <div key={subsIdx} className="relative flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-800 rounded-2xl sm:rounded-[40px] p-4 pb-0 sm:p-5 sm:pb-0 lg:p-24">
          <div className="absolute inset-0">
            <Image fill className="absolute object-contain object-bottom w-full h-full dark:opacity-5" src={backgroundLineSvg} alt="backgroundLineSvg" />
          </div>

          <div className="lg:w-[50%] max-w-lg relative">
            <h2 className="text-4xl font-semibold md:text-5xl"> {subs?.subscription_title} </h2>
            <span className="block mt-5 text-neutral-500 dark:text-neutral-400"> {subs?.subscription_subtitle} </span>
            <form className="relative max-w-sm mt-10" onSubmit={(e) => { e.preventDefault(); submitSubscription(value) }} >
              <Input required aria-required placeholder={translate('common.message.enterYourEmailText')} type="email" value={value} onChange={handleChange} rounded="rounded-full" />
              <ButtonCircle type="submit" className="absolute transform -translate-y-1/2 top-1/2 right-1" >
                <ArrowSmallRightIcon className="w-6 h-6" />
              </ButtonCircle>
            </form>
            {err ? <p className="px-0 mt-1 text-sm error-text-clr sm:px-0">{err}</p> : null}
          </div>
          <img alt={subs?.subscription_title} src={generateUri(subs?.subscription_image, "h=500&fm=webp") || IMG_PLACEHOLDER} sizes="(max-width: 768px) 100vw, 50vw " className="relative block lg:absolute lg:right-0 lg:bottom-0 mt-10 lg:mt-0 max-w-lg lg:max-w-[calc(40%-40px)]" />
        </div>
      ))}
    </div>
  );
};

export default SectionPromo3;
