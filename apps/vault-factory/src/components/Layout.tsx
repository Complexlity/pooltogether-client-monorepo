import { ConnectButton } from '@rainbow-me/rainbowkit'
import classNames from 'classnames'
import Head from 'next/head'
import Image from 'next/image'
import { ReactNode } from 'react'
import { PoweredByPT } from './PoweredByPT'

interface LayoutProps {
  children: ReactNode
  isSidebarActive?: boolean
  className?: string
}

export const Layout = (props: LayoutProps) => {
  const { children, isSidebarActive, className } = props

  return (
    <div className='flex flex-col min-h-screen overflow-x-hidden'>
      <Head>
        <title>Cabana Factory</title>
      </Head>

      <SimpleNavbar />

      {isSidebarActive && <div className='fixed w-[28rem] h-screen bg-pt-transparent' />}

      <main
        className={classNames(
          'w-full min-h-[calc(100vh-16rem)] relative flex flex-col items-center mx-auto md:px-4',
          className
        )}
      >
        {children}
      </main>

      <SimpleFooter isSidebarActive={isSidebarActive} />
    </div>
  )
}

interface SimpleNavbarProps {
  className?: string
}

const SimpleNavbar = (props: SimpleNavbarProps) => {
  const { className } = props

  return (
    <div
      className={classNames(
        'flex flex-row gap-6 items-center justify-between pt-6 pb-8 px-12 z-30 md:h-36 md:pt-0 md:pb-0',
        className
      )}
    >
      <div className='w-[25rem] pr-12'>
        <Image
          src='/cabanaLogo.svg'
          alt='Cabana Logo'
          width={260}
          height={99}
          priority={true}
          className='w-64 h-auto mx-auto'
        />
      </div>
      <ConnectButton
        showBalance={false}
        chainStatus={{ smallScreen: 'icon', largeScreen: 'full' }}
        accountStatus='full'
      />
    </div>
  )
}

interface SimpleFooterProps {
  isSidebarActive?: boolean
  className?: string
}

const SimpleFooter = (props: SimpleFooterProps) => {
  const { isSidebarActive, className } = props

  return (
    <footer className={classNames('h-28 flex items-center mt-auto px-2 z-20 md:px-0', className)}>
      {isSidebarActive && (
        <div className='w-[28rem]'>
          <PoweredByPT className='mx-auto' />
        </div>
      )}
      <div className='mx-auto'>
        <span className='text-center text-sm font-medium'>
          Made with ❤️ & 🤖 by{' '}
          <a href='https://g9software.xyz' target='_blank' className='hover:text-pt-teal'>
            Generation Software
          </a>
        </span>
      </div>
    </footer>
  )
}
