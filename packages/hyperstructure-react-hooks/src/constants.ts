import { LOCAL_STORAGE_KEYS as GENERIC_LOCAL_STORAGE_KEYS } from '@shared/generic-react-hooks'

/**
 * Query keys for various hooks
 */
export const QUERY_KEYS = {
  block: 'block',
  blockAtTimestamp: 'blockAtTimestamp',
  clientChainId: 'clientChainId',
  drawAuctionDuration: 'drawAuctionDuration',
  drawAwardedEvents: 'drawAwardedEvents',
  drawFinishedEvents: 'drawFinishedEvents',
  drawManagerDrawAwardedEvents: 'drawManagerDrawAwardedEvents',
  drawPeriod: 'drawPeriod',
  drawStartedEvents: 'drawStartedEvents',
  drawTimestamps: 'drawTimestamps',
  drawWinners: 'drawWinners',
  estimatedPrizeCount: 'estimatedPrizeCount',
  firstDrawOpenedAt: 'firstDrawOpenedAt',
  gasAmountEstimates: 'gasAmountEstimates',
  gasFeeEstimate: 'gasFeeEstimate',
  gasPrices: 'gasPrices',
  historicalTokenPrices: 'historicalTokenPrices',
  lastAwardedDrawId: 'lastAwardedDrawId',
  lastAwardedDrawTimestamps: 'lastAwardedDrawTimestamps',
  liquidationEvents: 'liquidationEvents',
  manualContributionEvents: 'manualContributionEvents',
  prizeBackstopEvents: 'prizeBackstopEvents',
  prizeInfo: 'prizeInfo',
  prizeOdds: 'prizeOdds',
  prizePoolDrawAwardedEvents: 'prizePoolDrawAwardedEvents',
  prizeTokenData: 'prizeTokenData',
  promotionCreatedEvents: 'promotionCreatedEvents',
  promotionRewardsClaimedEvents: 'promotionRewardsClaimedEvents',
  promotionInfo: 'promotionInfo',
  selectedVaults: 'selectedVaults',
  totalPrizesAvailable: 'totalPrizesAvailable',
  tokenAllowances: 'tokenAllowances',
  tokenBalances: 'tokenBalances',
  tokenDomain: 'tokenDomain',
  tokenNonces: 'tokenNonces',
  tokenPermitSupport: 'tokenPermitSupport',
  tokenPrices: 'tokenPrices',
  tokenTransferEvents: 'tokenTransferEvents',
  tokens: 'tokens',
  txReceipt: 'txReceipt',
  userBalanceUpdates: 'userBalanceUpdates',
  userClaimableRewards: 'userClaimableRewards',
  userEligibleDraws: 'userEligibleDraws',
  userVaultBalances: 'userVaultBalances',
  userVaultDelegate: 'userVaultDelegate',
  userVaultDelegationBalances: 'userVaultDelegationBalances',
  userWins: 'userWins',
  vaultBalances: 'vaultBalances',
  vaultClaimers: 'vaultClaimers',
  vaultContributionAmounts: 'vaultContributionAmounts',
  vaultContributionEvents: 'vaultContributionEvents',
  vaultExchangeRates: 'vaultExchangeRates',
  vaultFeeInfo: 'vaultFeeInfo',
  vaultFeesAvailable: 'vaultFeeInfo',
  vaultLiquidationPairs: 'vaultLiquidationPairs',
  vaultList: 'vaultList',
  vaultOwner: 'vaultOwner',
  vaultPercentageContributions: 'vaultPercentageContributions',
  vaultShareData: 'vaultShareData',
  vaultTokenAddresses: 'vaultTokenAddresses',
  vaultTokenData: 'vaultTokenData',
  vaultTotalSupplyTwabs: 'vaultTotalSupplyTwabs',
  vaultTwabController: 'vaultTwabController',
  vaultYieldSources: 'vaultYieldSources',
  walletAddresses: 'walletAddresses'
} as const

/**
 * Local storage keys
 */
export const LOCAL_STORAGE_KEYS = {
  ...GENERIC_LOCAL_STORAGE_KEYS,
  cachedVaultLists: 'cachedVaultLists',
  localVaultListIds: 'localVaultListIds',
  importedVaultListIds: 'importedVaultListIds',
  lastCheckedPrizesTimestamps: 'lastCheckedPrizesTimestamps'
} as const
