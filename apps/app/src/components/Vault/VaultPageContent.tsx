import { Vault } from '@pooltogether/hyperstructure-client-js'
import {
  usePublicClientsByChain,
  useSelectedVaults,
  useVaultTokenAddress
} from '@pooltogether/hyperstructure-react-hooks'
import { ErrorPooly } from '@shared/react-components'
import { Button } from '@shared/ui'
import { getVaultId, NETWORK } from '@shared/utilities'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'
import { useMemo } from 'react'
import { isAddress } from 'viem'
import { useNetworks } from '@hooks/useNetworks'
import { VaultPageButtons } from './VaultPageButtons'
import { VaultPageHeader } from './VaultPageHeader'
import { VaultPageInfo } from './VaultPageInfo'

interface VaultPageContentProps {
  queryParams: ParsedUrlQuery
}

// TODO: display notice that external vaults aren't in the selected vaultlists somewhere on the page
export const VaultPageContent = (props: VaultPageContentProps) => {
  const { queryParams } = props

  const networks = useNetworks()
  const clientsByChain = usePublicClientsByChain()

  const { vaults } = useSelectedVaults()

  const chainId =
    !!queryParams.chainId &&
    typeof queryParams.chainId === 'string' &&
    networks.includes(parseInt(queryParams.chainId))
      ? (parseInt(queryParams.chainId) as NETWORK)
      : undefined

  const address =
    !!queryParams.vaultAddress &&
    typeof queryParams.vaultAddress === 'string' &&
    isAddress(queryParams.vaultAddress)
      ? queryParams.vaultAddress
      : undefined

  const vault = useMemo(() => {
    if (!!chainId && !!address) {
      const vaultId = getVaultId({ chainId, address })
      return vaults?.vaults[vaultId] ?? new Vault(chainId, address, clientsByChain[chainId])
    }
  }, [chainId, address, vaults])

  const { data: vaultTokenAddress, isFetched: isFetchedVaultTokenAddress } = useVaultTokenAddress(
    vault as Vault
  )

  const isInvalidVault = isFetchedVaultTokenAddress && !vaultTokenAddress

  if (!!vault) {
    return (
      <>
        <VaultPageHeader vault={vault} />
        {!isInvalidVault ? (
          <>
            <VaultPageInfo vault={vault} />
            <VaultPageButtons vault={vault} />
          </>
        ) : (
          <ErrorState />
        )}
      </>
    )
  }

  return <ErrorState />
}

const ErrorState = () => {
  const t_vault = useTranslations('Vault')
  const t_error = useTranslations('Error')

  return (
    <div className='flex flex-col gap-6 items-center text-center'>
      <ErrorPooly className='w-full max-w-[50%]' />
      <span>{t_error('vaultInfoQuery')}</span>
      <Link href='/vaults' passHref={true}>
        <Button>{t_vault('returnToVaults')}</Button>
      </Link>
    </div>
  )
}