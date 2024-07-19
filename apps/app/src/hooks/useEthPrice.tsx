import { NETWORK, USDC_TOKEN_ADDRESSES } from '@generationsoftware/hyperstructure-client-js'
import { useTokenPrices } from '@generationsoftware/hyperstructure-react-hooks'
import { useMemo } from 'react'

export function useEthPriceInUsd(): {
  [address: `0x${string}`]: number
  data: number | undefined
} {
  const tokenPrices = useTokenPrices(NETWORK.mainnet, [USDC_TOKEN_ADDRESSES[NETWORK.mainnet]])

  const usdcPrice = useMemo(() => {
    if (tokenPrices.isFetched && !!tokenPrices.data) {
      return tokenPrices.data[USDC_TOKEN_ADDRESSES[NETWORK.mainnet]]
    }
  }, [tokenPrices])

  return { ...tokenPrices, data: !!usdcPrice ? 1 / usdcPrice : undefined }
}
