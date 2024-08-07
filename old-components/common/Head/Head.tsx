import { FC } from 'react'
import { matchStrings } from '@framework/utils/parse-util'

const Head: FC<any> = ({ configSettings, seoSettings = null }: any) => {
  const getConfig = () => {
    if (seoSettings) {
      return seoSettings;
    }
    if (configSettings?.length) {
      const seoSetting = configSettings?.find((cnf: any) => matchStrings(cnf.configType, "SeoSettings", true));
      if (seoSetting?.configKeys?.length) {
        const title = seoSetting?.configKeys?.find((setting: any) => matchStrings(setting?.key, "SeoSettings.DefaultTitle", true))?.value;
        const keywords = seoSetting?.configKeys?.find((setting: any) => matchStrings(setting?.key, "SeoSettings.DefaultMetaKeywords", true))?.value;
        const description = seoSetting?.configKeys?.find((setting: any) => matchStrings(setting?.key, "SeoSettings.DefaultMetaDescription", true))?.value;
        return {
          title: title,
          keywords: keywords,
          description: description
        };
      }
    }
    return null;
  }

  return (
    <>
     
    </>
  )
}

export default Head
