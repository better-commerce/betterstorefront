import { getCommerceProvider, useCommerce as useCoreCommerce } from '@commerce'
import { betterCommerceProvider, BetterCommerceProvider } from './provider'
import useEngageAI from './analytics/use-engage-ai';

export { betterCommerceProvider }
export type { BetterCommerceProvider }

export const CommerceProvider = getCommerceProvider(betterCommerceProvider)

export const useCommerce = () => useCoreCommerce<BetterCommerceProvider>()
export { useEngageAI };