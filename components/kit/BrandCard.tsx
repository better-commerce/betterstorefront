import { useEffect, useState } from 'react'
import sortBy from 'lodash/sortBy'
import { useRouter } from 'next/router'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'

function BrandCard(props: any) {
  const {
    logoImageName = '',
    brandName = '',
    platforms = [],
    id: brandId,
    bgColour,
    fontColour
  } = props
  const [platformOpts, setPlatformOpts] = useState<any>([])
  const [selectPlatformOpt, setSelectPlatformOpt] = useState<any>(null)
  const [totalProductCount, setTotalProductCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (platforms?.length < 1) return
    setPlatformOpts(sortBy(platforms, 'displayOrder'))
    let allProductsCount = 0
    platforms?.forEach((o: any) => {
      allProductsCount += o.productCount
    })
    setTotalProductCount(allProductsCount)
  }, [platforms])

  const handleSelectPlatform = (e: any) => {
    const val = e.target.value
    setSelectPlatformOpt(platformOpts?.find((o: any) => o.id === val))
  }

  const handlePush = () => {
    let url = new URL(`/kit/brand/${brandName}`, window.location.origin)
    url.searchParams.set('platform', selectPlatformOpt?.name)
    // push to brand page
    router.push(url.pathname + url.search)
  }

  return (
    <>
      <div
        className={`flex flex-col justify-center text-center items-center p-6 rounded-md`}
        style={{ backgroundColor: bgColour }}
      >
        <div className="justify-center flex-1 text-center custom-card-image">
          <img
            src={logoImageName || IMG_PLACEHOLDER}
            alt={brandName}
            width={250}
            height={40}
            
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex items-center justify-center flex-1 w-full my-2 text-center sm:my-4">
          <span className="flex items-center justify-center w-8 h-8 mr-1 text-xs font-semibold text-black bg-white border border-black rounded-full shadow-md">
            {selectPlatformOpt?.productCount || totalProductCount}
          </span>
          <span
            className="font-semibold font-18 dark:text-black"
            style={{
              color: fontColour,
            }}
          >
            Available Products
          </span>
        </div>
        <div className="relative flex justify-center flex-1 w-full custom-select">
          <select
            className="w-full px-3 py-3 my-3 font-semibold text-center text-black rounded-sm dark:bg-white dark:text-black"
            onChange={handleSelectPlatform}
          >
            <option selected disabled>
              Pick a platform
            </option>
            {platformOpts?.map((o: any) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-1 w-full">
          <button
            className="w-full btn-primary !py-3 disabled:cursor-not-allowed disabled:opacity-30"
            disabled={!selectPlatformOpt || !selectPlatformOpt?.id}
            onClick={handlePush}
          >
            Start Kit
          </button>
        </div>
      </div>
    </>
  )
}

export default BrandCard
