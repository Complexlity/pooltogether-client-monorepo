import { Vault, vaultABI } from '@generationsoftware/hyperstructure-client-js'
import { CAIP19, createSession } from '@paywithglide/glide-js'
import { useMutation } from '@tanstack/react-query'
import { Address, parseUnits } from 'viem'
import { useAccount } from 'wagmi'
import { crossTokenDetails } from '@components/Modals/DepositModal/DepositForm'
import { GLIDE_CONFIG as glideConfig } from '@constants/glide'

/**
 * Prepares and submits a `deposit` transaction to a vault
 * @param amount the amount to deposit
 * @param vault the vault to deposit into
 * @param options optional callbacks
 * @returns
 */
export const useCrossCreateSessionTransaction = (
  amount: string,
  vault: Vault,
  crossTokenDetails: crossTokenDetails,

  options?: {
    onSend?: (txHash: `0x${string}`) => void
    onSuccess?: () => void
    onError?: () => void
  }
) => {
  const { address: userAddress } = useAccount()

  const tokenPriceUsd = Number(crossTokenDetails.balanceUSD) / Number(crossTokenDetails.balance)
  let vaultDecimals = vault.decimals
  if (!vaultDecimals) {
    console.log('Vault Decimals missing...')
    vaultDecimals = 6
  }

  let depositAmount = parseUnits(`${tokenPriceUsd * Number(amount)}`, vaultDecimals)

  const {
    mutate: createSessionTransaction,
    data: session,
    isPending: isCreatingSession,
    isError: isCreateSessionError
  } = useMutation({
    mutationFn: async () => {
      const parameters = {
        chainId: 10 as 10 | 8453,
        account: userAddress as Address,
        abi: vaultABI,
        address: vault?.address as Address,
        args: [depositAmount, userAddress as Address],
        functionName: 'deposit',
        paymentCurrency: crossTokenDetails.paymentCurrency as CAIP19
      }

      console.log(parameters.args[0])

      const session = await createSession(glideConfig, parameters)
      return session
    },
    onSuccess: () => {
      options?.onSuccess?.()
    },
    onError: () => {}
  })

  return { isCreatingSession, isCreateSessionError, session, createSessionTransaction }
}
