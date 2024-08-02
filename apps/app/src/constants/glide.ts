import { SUPPORTED_NETWORKS } from '@constants/config'
import { Chain, Config, createGlideConfig } from '@paywithglide/glide-js'

import { RPC_URLS, WAGMI_CHAINS } from '@constants/config'

const networks = [...SUPPORTED_NETWORKS.mainnets, ...SUPPORTED_NETWORKS.testnets]

const supportedNetworks = Object.values(WAGMI_CHAINS).filter(
  (chain) => networks.includes(chain.id) && !!RPC_URLS[chain.id]
) as any as [Chain, ...Chain[]]

// console.log("https://paywithglide.xyz/")
const projectId = process.env.NEXT_PUBLIC_GLIDE_PROJECT_ID
if (!projectId) throw new Error('Glide project Id missing from .env')

const GLIDE_CONFIG: Config<readonly Chain[]> = createGlideConfig({
  projectId: projectId,
  chains: [...supportedNetworks]
})

export { GLIDE_CONFIG }
