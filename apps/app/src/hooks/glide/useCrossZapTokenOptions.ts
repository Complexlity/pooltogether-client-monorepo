import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { listPaymentOptions, PaymentOption } from '@paywithglide/glide-js'
import { vaultABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address, parseUnits } from 'viem'
import { GLIDE_CONFIG } from '@constants/glide'

const DEFAULT_DEPOSIT_AMOUNT = '1'
export const getChainIdFromString = (stringChainId: `eip155:${number}`) => {
  return Number(stringChainId.split(':')[1])
}

// export const getTokenAddressFromEipString = (eipString: string) {

// }

export function useCrossZapTokenOptions(vault: Vault, userAddress: Address) {
  const depositAmount = parseUnits(DEFAULT_DEPOSIT_AMOUNT, 6)
  return useQuery({
    queryKey: ['crossZapOptions', vault.address],
    queryFn: async () => {
      const paymentOptions = await listPaymentOptions(GLIDE_CONFIG, {
        chainId: vault.chainId,
        account: userAddress,

        abi: vaultABI,
        address: vault.address,
        args: [depositAmount, userAddress],
        functionName: 'deposit'
      })
      const returned = paymentOptions
        .filter((item) => !(getChainIdFromString(item.chainId) == vault.chainId))
        .reduce((acc, curr) => {
          const chainId = getChainIdFromString(curr.chainId)
          const availableOptionsInChainId = acc[chainId] ?? []
          const tokenDecimals = curr.currencySymbol === 'USDC' ? 6 : 18
          availableOptionsInChainId.push({ ...curr, decimals: tokenDecimals })
          acc[chainId] = availableOptionsInChainId
          return acc
        }, {} as Record<string, (PaymentOption & { decimals: number })[]>)

      return returned
    },
    enabled: !!userAddress
  })
}

// {
//     chainId: 10,
//     address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
//     symbol: 'USDC',
//     name: 'USD Coin',
//     decimals: 6,
//     totalSupply: 178147573545064n,
//     amount: 40342224n,
//     price: 0.00029194687,
//     value: 0.01177778602563888
// },
