import { Vault, vaultABI } from '@generationsoftware/hyperstructure-client-js'
import { CAIP19, createSession } from '@paywithglide/glide-js'
import { useQuery } from '@tanstack/react-query'
import { Address, parseUnits } from 'viem'
import { useAccount } from 'wagmi'
import { crossTokenDetails } from '@components/Modals/DepositModal/DepositForm'
import { GLIDE_CONFIG as glideConfig } from '@constants/glide'

const GLIDE_SESSION_REFETCH_INTERVAL = 2 * 60 * 1000
/**
 * Prepares and submits a `deposit` transaction to a vault
 * @param amount the amount to deposit
 * @param vault the vault to deposit into
 * @param options optional callbacks
 * @returns
 */
export const useCreateSessionAtIntervals = (
  loadingSession: boolean,
  amount: string,
  vault: Vault,
  crossTokenDetails: crossTokenDetails
) => {
  const { address: userAddress } = useAccount()

  const tokenPriceUsd = Number(crossTokenDetails.balanceUSD) / Number(crossTokenDetails.balance)
  let vaultDecimals = vault.decimals
  if (!vaultDecimals) {
    console.log('Vault Decimals missing...')
    vaultDecimals = 6
  }

  let depositAmount = parseUnits(`${tokenPriceUsd * Number(amount)}`, vaultDecimals)

  let {
    data: session,
    isFetching,
    isLoading,
    isPending,
    isRefetching,
    isError: isCreateSessionError,
    isSuccess: isCreatingSessionSuccess
  } = useQuery({
    queryKey: [`glideSession`],
    queryFn: async () => {
      const parameters = {
        chainId: vault.chainId,
        account: userAddress as Address,
        abi: vaultABI,
        address: vault?.address as Address,
        args: [depositAmount, userAddress as Address],
        functionName: 'deposit',
        paymentCurrency: crossTokenDetails.paymentCurrency as CAIP19
      }

      const session = await createSession(glideConfig, parameters)

      return session
    },
    enabled: !!loadingSession,
    refetchInterval: GLIDE_SESSION_REFETCH_INTERVAL
  })

  const isCreatingSession = isFetching || isPending || isLoading || isRefetching
  return { isCreatingSession, isCreateSessionError, session, isCreatingSessionSuccess }
}
