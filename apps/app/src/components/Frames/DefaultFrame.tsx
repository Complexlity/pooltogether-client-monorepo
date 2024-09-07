import { DOMAINS } from '@shared/utilities'
import Head from 'next/head'

// export const DefaultFrame = () => (
//   <Head>
//     <meta property='fc:frame' content='vNext' />
//     <meta property='fc:frame:image' content={`${DOMAINS.app}/facebook-share-image-1200-630.png`} />
//     <meta name='fc:frame:button:1' content='Prizes' />
//     <meta name='fc:frame:button:1:action' content='link' />
//     <meta name='fc:frame:button:1:target' content={`${DOMAINS.app}/prizes`} />
//     <meta name='fc:frame:button:2' content='Vaults' />
//     <meta name='fc:frame:button:2:action' content='link' />
//     <meta name='fc:frame:button:2:target' content={`${DOMAINS.app}/vaults`} />
//     <meta name='fc:frame:button:3' content='Account' />
//     <meta name='fc:frame:button:3:action' content='link' />
//     <meta name='fc:frame:button:3:target' content={`${DOMAINS.app}/account`} />
//     <meta name='fc:frame:button:4' content='Docs' />
//     <meta name='fc:frame:button:4:action' content='link' />
//     <meta name='fc:frame:button:4:target' content={DOMAINS.docs} />
//   </Head>
// )

export const DefaultFrame = () => (
  <Head>
    <meta property='fc:frame' content='vNext' />
    <meta property='fc:frame:image:aspect_ratio' content='1.91:1' />
    <meta property='fc:frame:image' content='https://i.ibb.co/ggHZQ8r/start.png' />
    <meta property='og:image' content='https://i.ibb.co/ggHZQ8r/start.png' />
    <meta property='og:title' content='Cross deposit into pool together' />
    <meta
      property='fc:frame:post_url'
      content='http://localhost:5173/api/vaults/1?initialPath=%252Fapi&previousButtonValues=%2523A_0%252C1%252C2%252C_l'
    />
    <meta property='fc:frame:button:1' content='przUSDC OP' data-value='0' />
    <meta property='fc:frame:button:1:action' content='post' />
    <meta property='fc:frame:button:2' content='przUSDC BASE' data-value='1' />
    <meta property='fc:frame:button:2:action' content='post' />
    <meta property='fc:frame:button:3' content='przUSDC ARB' data-value='2' />
    <meta property='fc:frame:button:3:action' content='post' />
    <meta property='fc:frame:button:4' content='App' data-value='_l' />
    <meta property='fc:frame:button:4:action' content='link' />
    <meta property='fc:frame:button:4:target' content='https://cabana-glide.vercel.app/vaults' />
    <meta property='frog:version' content='0.17.1' />
    <meta
      property='frog:context'
      content='%7B%22cycle%22%3A%22main%22%2C%22env%22%3A%7B%7D%2C%22initialPath%22%3A%22%2Fapi%22%2C%22previousState%22%3A%7B%22uA%22%3Anull%2C%22vault%22%3A%7B%22chainId%22%3A10%2C%22address%22%3A%220x03D3CE84279cB6F54f5e6074ff0F8319d830dafe%22%2C%22name%22%3A%22przUSDC%20OP%22%2C%22title%22%3A%22przUSDC%20on%20Optimism%22%2C%22logo%22%3A%22https%3A%2F%2Fcryptologos.cc%2Flogos%2Fusd-coin-usdc-logo.svg%3Fv%3D029%22%7D%2C%22pO%22%3A%5B%5D%2C%22pOO%22%3A%5B%5D%2C%22dC%22%3Anull%7D%2C%22status%22%3A%22initial%22%2C%22url%22%3A%22http%3A%2F%2Flocalhost%3A5173%2Fapi%22%2C%22var%22%3A%7B%7D%2C%22verified%22%3Afalse%2C%22state%22%3A%7B%22uA%22%3Anull%2C%22vault%22%3A%7B%22chainId%22%3A10%2C%22address%22%3A%220x03D3CE84279cB6F54f5e6074ff0F8319d830dafe%22%2C%22name%22%3A%22przUSDC%20OP%22%2C%22title%22%3A%22przUSDC%20on%20Optimism%22%2C%22logo%22%3A%22https%3A%2F%2Fcryptologos.cc%2Flogos%2Fusd-coin-usdc-logo.svg%3Fv%3D029%22%7D%2C%22pO%22%3A%5B%5D%2C%22pOO%22%3A%5B%5D%2C%22dC%22%3Anull%7D%7D'
    />
  </Head>
)
