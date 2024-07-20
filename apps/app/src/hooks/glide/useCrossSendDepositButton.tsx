import { Vault, vaultABI } from '@generationsoftware/hyperstructure-client-js'
import { CAIP19, createSession, executeSession } from '@paywithglide/glide-js'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Address, parseUnits, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSendTransaction,
  useSignTypedData,
  useSwitchChain,
  useWaitForTransactionReceipt
} from 'wagmi'
import { crossTokenDetails } from '@components/Modals/DepositModal/DepositForm'
import { GLIDE_CONFIG as glideConfig } from '@constants/glide'

// export function getEthPrice(
//   nativePrice: string,
//   usdPrice: number,
//   ethAmount: number
// ) {
//   const nativePriceInETH = BigInt(nativePrice) / BigInt("1000000000000000000");
//   const ethAmountInUsd =
//     (usdPrice / Number(nativePriceInETH)) * 1e18 * ethAmount;
//   return ethAmountInUsd;
// }

/**
 * Prepares and submits a `deposit` transaction to a vault
 * @param amount the amount to deposit
 * @param vault the vault to deposit into
 * @param options optional callbacks
 * @returns
 */
export const useCrossSendDepositTransaction = (
  amount: string,
  vault: Vault,
  crossTokenDetails: crossTokenDetails,

  options?: {
    onSend?: (txHash: `0x${string}`) => void
    onSuccess?: (txReceipt: TransactionReceipt) => void
    onError?: () => void
  }
) => {
  const { address: userAddress, chain } = useAccount()

  const { switchChainAsync } = useSwitchChain()
  const { sendTransactionAsync } = useSendTransaction()
  const { signTypedDataAsync } = useSignTypedData()

  // const gasEstimate = null

  const tokenPriceUsd = Number(crossTokenDetails.balanceUSD) / Number(crossTokenDetails.balance)
  let vaultDecimals = vault.decimals
  if (!vaultDecimals) {
    console.log('Vault Decimals missing...')
    vaultDecimals = 6
  }

  let depositAmount = parseUnits(`${tokenPriceUsd * Number(amount)}`, vaultDecimals)

  async function send() {
    //Test eth parameters
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

    const { sponsoredTransactionHash } = await executeSession(glideConfig, {
      session,
      currentChainId: crossTokenDetails.chainId,
      switchChainAsync,
      sendTransactionAsync,
      signTypedDataAsync
    })
    console.log({ sponsoredTransactionHash })
    return sponsoredTransactionHash
  }

  const {
    mutate: sendDepositTransaction,
    data: txHash,
    isPending: isWaiting,
    isError: isSendingError
  } = useMutation({
    mutationFn: async () => {
      const txHash = await send()
      console.log({ txHash })
      return txHash
    },
    onSuccess: (txHash) => {
      options?.onSend?.(txHash)
    }
  })

  const {
    data: txReceipt,
    isFetching: isConfirming,
    isSuccess,
    isError: isConfirmingError
  } = useWaitForTransactionReceipt({ chainId: vault?.chainId, hash: txHash })

  useEffect(() => {
    if (!!txReceipt && isSuccess) {
      options?.onSuccess?.(txReceipt)
    }
  }, [isSuccess])

  const isError = isSendingError || isConfirmingError

  useEffect(() => {
    if (isError) {
      options?.onError?.()
    }
  }, [isError])

  return { isWaiting, isConfirming, txReceipt, isSuccess, isError, txHash, sendDepositTransaction }
}

var getMaxPrecision = (val: number) => {
  return val.toString().split('.')[1]?.length || 0
}
