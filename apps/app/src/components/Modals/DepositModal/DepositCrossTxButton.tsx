import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useUserVaultDelegationBalance,
  useUserVaultTokenBalance,
  useVaultBalance,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Session } from '@paywithglide/glide-js'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { TransactionButton } from '@shared/react-components'
import { Button, Spinner } from '@shared/ui'
import { vaultABI } from '@shared/utilities'
import { useQueryClient } from '@tanstack/react-query'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { getRoundedDownFormattedTokenAmount } from 'src/utils'
import { Address, decodeFunctionData, TransactionReceipt } from 'viem'
import { useAccount } from 'wagmi'
import { useCreateSessionAtIntervals } from '@hooks/glide/useCreateSessionAtIntervals'
import { useCrossSendDepositTransaction } from '@hooks/glide/useCrossSendDepositButton'
import { DepositModalView } from '.'
import {
  crossTokenDetails,
  depositFormShareAmountAtom,
  depositFormTokenAmountAtom,
  isLoadingSessionAtom
} from './DepositForm'

interface DepositTxButtonProps {
  vault: Vault
  modalView: string
  crossTokenDetails: crossTokenDetails
  setModalView: (view: DepositModalView) => void
  setDepositTxHash: (txHash: string) => void
  refetchUserBalances?: () => void
  onSuccessfulApproval?: () => void
  onSuccessfulDeposit?: (chainId: number, txReceipt: TransactionReceipt) => void
}

export const currentCrossingSessionAtom = atom<Session | undefined>(undefined)
export const DepositCrossTxButton = (props: DepositTxButtonProps) => {
  const {
    vault,
    modalView,
    crossTokenDetails,
    setModalView,
    setDepositTxHash,
    refetchUserBalances,
    onSuccessfulApproval,
    onSuccessfulDeposit
  } = props

  const queryClient = useQueryClient()
  const t_common = useTranslations('Common')
  const t_modals = useTranslations('TxModals')
  const t_tooltips = useTranslations('Tooltips')

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const [isLoadingSession, setIsLoadingSession] = useAtom(isLoadingSessionAtom)
  const setCurrentSession = useSetAtom(currentCrossingSessionAtom)
  const setFormShareAmount = useSetAtom(depositFormShareAmountAtom)

  const { address: userAddress, chain, isDisconnected } = useAccount()

  const { data: tokenData } = useVaultTokenData(vault)

  const { refetch: refetchUserVaultTokenBalance } = useUserVaultTokenBalance(
    vault,
    userAddress as Address
  )

  const { refetch: refetchUserVaultDelegationBalance } = useUserVaultDelegationBalance(
    vault,
    userAddress as Address
  )

  const { refetch: refetchVaultBalance } = useVaultBalance(vault)

  const formTokenAmount = useAtomValue(depositFormTokenAmountAtom)

  const isValidFormInputTokenAmount =
    !!formTokenAmount && !Number.isNaN(Number(formTokenAmount)) && parseFloat(formTokenAmount) > 0

  const depositEnabled =
    Number(crossTokenDetails.balance) >= Number(formTokenAmount) && isValidFormInputTokenAmount

  const { isCreateSessionError, isCreatingSession, session, isCreatingSessionSuccess } =
    useCreateSessionAtIntervals(isLoadingSession, formTokenAmount, vault, crossTokenDetails)

  useEffect(() => {
    setModalView('main')
    setIsLoadingSession(false)
  }, [])

  useEffect(() => {
    if (!!isCreateSessionError && !isCreatingSession) {
      setIsLoadingSession(false)
    } else if (!!isCreatingSessionSuccess && !isCreatingSession) {
      setModalView('review')
      setCurrentSession(session)
    }
  }, [isCreatingSession, isCreateSessionError, isCreatingSessionSuccess, session])

  const sessionTransaction = useCrossSendDepositTransaction(
    session,
    formTokenAmount,
    vault,
    crossTokenDetails,
    {
      onSend: () => {
        setModalView('waiting')
      },
      onSuccess: (txReceipt) => {
        refetchUserVaultTokenBalance()
        refetchUserVaultDelegationBalance()
        refetchVaultBalance()
        refetchUserBalances?.()
        onSuccessfulDeposit?.(vault.chainId, txReceipt)
        queryClient.invalidateQueries({
          queryKey: ['crossZapOptions']
        })
        setModalView('success')
      },
      onError: () => {
        setModalView('error')
      }
    }
  )
  const {
    isWaiting: isWaitingDeposit,
    isConfirming: isConfirmingDeposit,
    isSuccess: isSuccessfulDeposit,
    txHash: depositTxHash,
    sendDepositTransaction
  } = sessionTransaction

  useEffect(() => {
    if (!!depositTxHash && isConfirmingDeposit && !isWaitingDeposit && !isSuccessfulDeposit) {
      setDepositTxHash(depositTxHash)
      setModalView('confirming')
    }
  }, [depositTxHash, isConfirmingDeposit])

  if (formTokenAmount === '0' || !formTokenAmount) {
    return (
      <Button color='transparent' fullSized={true} disabled={true}>
        {t_modals('enterAnAmount')}
      </Button>
    )
  }

  // Prompt to review deposit
  if (modalView === 'main' || !isLoadingSession) {
    if (isLoadingSession) {
      return (
        <Button fullSized={true} disabled={true}>
          <Spinner />
        </Button>
      )
    }
    return (
      <Button fullSized={true} disabled={!depositEnabled} onClick={() => setIsLoadingSession(true)}>
        {t_modals('reviewDeposit')}
      </Button>
    )
  }

  if (session?.sponsoredTransaction?.input) {
    const values = decodeFunctionData({ abi: vaultABI, data: session.sponsoredTransaction.input })

    if (vault.decimals && typeof values.args[0] === 'bigint') {
      const amount = getRoundedDownFormattedTokenAmount(values.args[0], vault.decimals)
      setFormShareAmount(amount)
    }
  }

  return (
    <TransactionButton
      chainId={crossTokenDetails.chainId}
      isTxLoading={!session || isCreatingSession || isWaitingDeposit || isConfirmingDeposit}
      isTxSuccess={isSuccessfulDeposit}
      write={sendDepositTransaction}
      txHash={depositTxHash}
      txDescription={t_modals('depositTx', { symbol: tokenData?.symbol ?? '?' })}
      fullSized={true}
      disabled={!depositEnabled || !session || isCreatingSession}
      openConnectModal={openConnectModal}
      openChainModal={openChainModal}
      addRecentTransaction={addRecentTransaction}
      intl={{ base: t_modals, common: t_common }}
    >
      {t_modals('confirmDeposit')}
    </TransactionButton>
  )
}
