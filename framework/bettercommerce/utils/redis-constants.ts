import { toNumber } from 'lodash'

//
import { decrypt } from './cipher'
import { stringToBoolean } from './parse-util'
import { EmptyString } from '@new-components/utils/constants'

export module Redis {
  // Redis data keys
  export module Key {
    export const NavTree = 'NavTree'
    export const HomepageWeb = 'HomepageWeb'
    export const CookiepageWeb = 'CookiepageWeb'
    export const CookiepageMobileWeb = 'CookiepageMobileWeb'
    export const ContactpageWeb = 'ContactpageWeb'
    export const ContactpageMobileWeb = 'ContactpageMobileWeb'
    export const PrivacypageWeb = 'PrivacypageWeb'
    export const PrivacypageMobileWeb = 'PrivacypageMobileWeb'
    export const TermspageWeb = 'TermspageWeb'
    export const TermspageMobileWeb = 'TermspageMobileWeb'
    export const HomepageMobileWeb = 'HomepageMobileWeb'
    export const Collection = 'Collection'
    export const INFRA_CONFIG = 'InfraConfig'
    export const HOME_SLUG_CONTENTS = 'HomeSlugContent'
    export module PDP {
      export const Products = 'Products'
      export const ProductsByCat = 'ProductsByCat'
      export const ProductReviewData = 'ProductReviewData'
      export const AvailablePromo = 'AvailablePromo'
      export const RelatedProduct = 'RelatedProduct'
      export const ReviewData = 'ReviewData'
      export const PDPLookBook = 'PDPLookBook'
      export const PDPCacheImage = 'PDPCacheImage'
      export const AllProductPath = 'AllProductPath'
    }
    export module Brands {
      export const Slug = 'Slug'
      export const Brand = 'Brand'
      export const FaqWeb = 'FaqWeb'
      export const FaqMobile = 'FaqMobile'
      export const HeroBanner = 'HeroBanner'
      export const Collection = 'Collection'
      export const PageContentsWeb = 'PageContentsWeb'
      export const PageContentsMob = 'PageContentsMob'
    }
    export module Category {
      export const Slug = "Slug"
      export const AllCategory = "AllCategory"
      export const Categories = "Categories"
      export const CategoryProduct = "CategoryProduct"
    }
  }
  // Redis server configs
  export module Server {
    export const REDIS_CACHE_DISABLED: boolean = stringToBoolean(process.env.REDIS_CACHE_DISABLED!)
    export const HOST: string = process.env.REDIS_HOST!
    export const PORT: number = process.env.REDIS_PORT ? toNumber(process.env.REDIS_PORT) : 0
    export const PWD: string = process.env.REDIS_PASSWORD ? decrypt(process.env.REDIS_PASSWORD!) : EmptyString
    export const EXPIRES_IN: number = process.env.REDIS_CACHE_DURATION_SECS ? toNumber(process.env.REDIS_CACHE_DURATION_SECS) : 0
  }
}
