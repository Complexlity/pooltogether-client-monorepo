import { Chain, chains, Config, createGlideConfig } from '@paywithglide/glide-js'

// console.log("https://paywithglide.xyz/")
const projectId = process.env.NEXT_PUBLIC_GLIDE_PROJECT_ID
if (!projectId) throw new Error('Glide project Id missing from .env')

const GLIDE_CONFIG: Config<readonly Chain[]> = createGlideConfig({
  projectId: projectId,
  chains: [chains.base, chains.optimism, chains.arbitrum]
})

export { GLIDE_CONFIG }
