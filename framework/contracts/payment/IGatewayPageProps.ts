import { IPaymentInfo } from '@better-commerce/bc-payments-sdk'

export interface IGatewayPageProps {
  readonly gateway: string
  readonly params?: {
    token?: string
    orderId?: string
    payerId?: string
    paymentInfo?: IPaymentInfo
  }
  readonly isCancelled: boolean
  readonly isCOD?: boolean
}
