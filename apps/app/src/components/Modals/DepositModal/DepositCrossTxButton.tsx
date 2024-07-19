import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSendApproveTransaction,
  useSendDepositTransaction,
  useTokenAllowance,
  useTokenBalance,
  useUserVaultDelegationBalance,
  useUserVaultTokenBalance,
  useVaultBalance,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { ApprovalTooltip, TransactionButton } from '@shared/react-components'
import { Button } from '@shared/ui'
import { isValidVaultList } from '@shared/utilities'
import { useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Address, parseUnits, TransactionReceipt } from 'viem'
import { useAccount } from 'wagmi'
import { useCrossSendDepositTransaction } from '@hooks/glide/useCrossSendDepositButton'
import { DepositModalView } from '.'
import { isValidFormInput } from '../TxFormInput'
import { crossTokenDetails, depositFormTokenAmountAtom } from './DepositForm'

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

  const { address: userAddress, chain, isDisconnected } = useAccount()

  const { data: tokenData } = useVaultTokenData(vault)

  // const {
  //   data: allowance,
  //   isFetched: isFetchedAllowance,
  //   refetch: refetchTokenAllowance
  // } = useTokenAllowance(
  //   vault.chainId,
  //   userAddress as Address,
  //   vault.address,
  //   tokenData?.address as Address
  // )

  // const {
  //   data: userTokenBalance,
  //   isFetched: isFetchedUserTokenBalance,
  //   refetch: refetchUserTokenBalance
  // } = useTokenBalance(vault.chainId, userAddress as Address, tokenData?.address as Address)

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

  //@ts-expect-error
  const isValidFormTokenAmount = isValidFormInput(formTokenAmount, crossTokenDetails.decimals)

  const depositEnabled = crossTokenDetails.balance >= formTokenAmount && isValidFormTokenAmount

  // const {
  //   isWaiting: isWaitingApproval,
  //   isConfirming: isConfirmingApproval,
  //   isSuccess: isSuccessfulApproval,
  //   txHash: approvalTxHash,
  //   sendApproveTransaction: sendApproveTransaction
  // } = useSendApproveTransaction(depositAmount, vault, {
  //   onSuccess: () => {
  //     refetchTokenAllowance()
  //     onSuccessfulApproval?.()
  //   }
  // })

  const {
    isWaiting: isWaitingDeposit,
    isConfirming: isConfirmingDeposit,
    isSuccess: isSuccessfulDeposit,
    txHash: depositTxHash,
    txReceipt,
    sendDepositTransaction
  } = useCrossSendDepositTransaction(formTokenAmount, vault, crossTokenDetails, {
    onSend: () => {
      setModalView('waiting')
    },
    onSuccess: (txReceipt) => {
      // refetchUserTokenBalance()
      refetchUserVaultTokenBalance()
      refetchUserVaultDelegationBalance()
      refetchVaultBalance()
      // refetchTokenAllowance()
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
  })

  useEffect(() => {
    if (!!depositTxHash && isConfirmingDeposit && !isWaitingDeposit && !isSuccessfulDeposit) {
      setDepositTxHash(depositTxHash)
      setModalView('confirming')
    }
  }, [depositTxHash, isConfirmingDeposit])

  // No deposit amount set
  if (formTokenAmount === '0') {
    return (
      <Button color='transparent' fullSized={true} disabled={true}>
        {t_modals('enterAnAmount')}
      </Button>
    )
  }

  // Prompt to review deposit
  if (modalView === 'main') {
    return (
      <Button onClick={() => setModalView('review')} fullSized={true} disabled={!depositEnabled}>
        {t_modals('reviewDeposit')}
      </Button>
    )
  }

  // Deposit button
  return (
    <TransactionButton
      chainId={crossTokenDetails.chainId}
      isTxLoading={isWaitingDeposit || isConfirmingDeposit}
      isTxSuccess={isSuccessfulDeposit}
      write={sendDepositTransaction}
      txHash={depositTxHash}
      txDescription={t_modals('depositTx', { symbol: tokenData?.symbol ?? '?' })}
      fullSized={true}
      disabled={!depositEnabled}
      openConnectModal={openConnectModal}
      openChainModal={openChainModal}
      addRecentTransaction={addRecentTransaction}
      intl={{ base: t_modals, common: t_common }}
    >
      {t_modals('confirmDeposit')}
    </TransactionButton>
  )
}
