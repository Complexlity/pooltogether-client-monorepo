import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { executeSession, Session } from '@paywithglide/glide-js'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { parseUnits, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSendTransaction,
  useSignTypedData,
  useSwitchChain,
  useWaitForTransactionReceipt
} from 'wagmi'
import { crossTokenDetails } from '@components/Modals/DepositModal/DepositForm'
import { GLIDE_CONFIG as glideConfig } from '@constants/glide'

/**
 * Prepares and submits a `deposit` transaction to a vault
 * @param amount the amount to deposit
 * @param vault the vault to deposit into
 * @param options optional callbacks
 * @returns
 */
export const useCrossSendDepositTransaction = (
  session: Session | undefined,
  vault: Vault,
  crossTokenDetails: crossTokenDetails,

  options?: {
    onSend?: (txHash: `0x${string}`) => void
    onSuccess?: (txReceipt: TransactionReceipt) => void
    onError?: () => void
  }
) => {
  const { switchChainAsync } = useSwitchChain()
  const { sendTransactionAsync } = useSendTransaction()
  const { signTypedDataAsync } = useSignTypedData()

  const {
    mutate: sendDepositTransaction,
    data: txHash,
    isPending: isWaiting,
    isError: isSendingError
  } = useMutation({
    mutationFn: async () => {
      const { sponsoredTransactionHash: txHash } = await executeSession(glideConfig, {
        //@ts-expect-error
        session,
        currentChainId: crossTokenDetails.chainId,
        switchChainAsync,
        sendTransactionAsync,
        signTypedDataAsync
      })

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
