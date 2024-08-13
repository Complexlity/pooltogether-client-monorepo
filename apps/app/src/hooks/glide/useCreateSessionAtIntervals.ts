import { Vault, vaultABI } from '@generationsoftware/hyperstructure-client-js'
import { useTokenPrices, useVaultTokenPrice } from '@generationsoftware/hyperstructure-react-hooks'
import { CAIP19, createSession } from '@paywithglide/glide-js'
import { useQuery } from '@tanstack/react-query'
import { Address, parseUnits } from 'viem'
import { useAccount } from 'wagmi'
import { crossTokenDetails } from '@components/Modals/DepositModal/DepositForm'
import { GLIDE_CONFIG as glideConfig } from '@constants/glide'
import { useEthPriceInUsd } from '@hooks/useEthPrice'

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
  const { data: vaultToken } = useVaultTokenPrice(vault)
  const { data: ethToUsdPrice } = useEthPriceInUsd()

  const tokenPriceUsd = Number(crossTokenDetails.balanceUSD) / Number(crossTokenDetails.balance)
  const tokenPriceEth = tokenPriceUsd / Math.round(ethToUsdPrice!)
  const tokenPriceInVaultToken = tokenPriceEth / vaultToken?.price!

  let vaultDecimals = vault.decimals
  if (!vaultDecimals) {
    vaultDecimals = 6
  }

  //Not really used as glide uses `paymentAmount`,
  // only passing it because dummy values don't work the same for all vaults i.e `0.001` in przWeth vault is okay but in usdc vaults is too small (and will error) and `1` in przUsdc vault is okay but in weth vault it is too big (and will error)
  let dummyDepositAmount = parseUnits(`${tokenPriceInVaultToken * Number(amount)}`, vaultDecimals)

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
        //Actual payment amount that is used by glide
        paymentAmount: Number(amount),
        chainId: vault.chainId,
        account: userAddress as Address,
        abi: vaultABI,
        address: vault?.address as Address,
        args: [dummyDepositAmount, userAddress as Address],
        functionName: 'deposit',
        paymentCurrency: crossTokenDetails.paymentCurrency as CAIP19
      }

      const session = await createSession(glideConfig, parameters)

      return session
    },
    enabled: !!loadingSession,
    refetchInterval: GLIDE_SESSION_REFETCH_INTERVAL,
    retry: false
  })

  const isCreatingSession = isFetching || isPending || isLoading || isRefetching
  return { isCreatingSession, isCreateSessionError, session, isCreatingSessionSuccess }
}
