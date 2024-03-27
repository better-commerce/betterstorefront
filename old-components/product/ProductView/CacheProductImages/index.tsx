// Base Imports
import React, { useEffect } from 'react'

// Other Imports
import { generateUri } from '@commerce/utils/uri-util'
import { PRODUCT_IMAGE_CDN_URL } from '@framework/utils/constants'

const CacheProductImages = ({ data = [], setIsLoading }: any) => {
  const cacheImages = async (images: any) => {
    const promises = await images?.map((src: string) => {
      return new Promise<void>(function (resolve, reject) {
        const img: any = Image
        img.src = src
        img.onload = resolve()
        img.onerror = reject()
      })
    })
    await Promise.all(promises)
    setIsLoading(false)
  }

  useEffect(() => {
    if (data?.length) {
      const images = data?.map((x: string) => {
        const appendCDN = !(
          x?.startsWith('http://') || x?.startsWith('https://')
        )
        const imgSrc = appendCDN ? PRODUCT_IMAGE_CDN_URL + x : x
        return generateUri(imgSrc, 'h=700&w=700&fm=webp')
      })
      //console.log(images);
      cacheImages(images)
    }
  }, [])

  return <></>
}

export default CacheProductImages
