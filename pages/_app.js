import './style.css'
import '@hashicorp/nextjs-scripts/lib/nprogress/style.css'

import Router from 'next/router'
import Head from 'next/head'
import NProgress from '@hashicorp/nextjs-scripts/lib/nprogress'
import MegaNav from '@hashicorp/react-mega-nav'
import HashiHead from '@hashicorp/react-head'
import Footer from '../components/footer'
import ProductSubnav from '../components/subnav'

NProgress({ Router })

function App({ Component, pageProps }) {
  return (
    <>
      <HashiHead
        is={Head}
        title="Nomad by HashiCorp"
        siteName="Nomad by HashiCorp"
        description="Nomad is a highly available, distributed, data-center aware cluster and application scheduler designed to support the modern datacenter with support for long-running services, batch jobs, and much more."
        image="https://www.nomadproject.io/img/og-image.png"
        stylesheet={[
          {
            href:
              'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&display=swap',
          },
        ]}
        icon={[{ href: '/favicon.ico' }]}
        preload={[
          { href: '/fonts/klavika/medium.woff2', as: 'font' },
          { href: '/fonts/gilmer/light.woff2', as: 'font' },
          { href: '/fonts/gilmer/regular.woff2', as: 'font' },
          { href: '/fonts/gilmer/medium.woff2', as: 'font' },
          { href: '/fonts/gilmer/bold.woff2', as: 'font' },
          { href: '/fonts/metro-sans/book.woff2', as: 'font' },
          { href: '/fonts/metro-sans/regular.woff2', as: 'font' },
          { href: '/fonts/metro-sans/semi-bold.woff2', as: 'font' },
          { href: '/fonts/metro-sans/bold.woff2', as: 'font' },
          { href: '/fonts/dejavu/mono.woff2', as: 'font' },
        ]}
      />
      <MegaNav product="Nomad" />
      <ProductSubnav />
      <div className="content">
        <Component {...pageProps} />
      </div>
      <Footer />
    </>
  )
}

App.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {}

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }

  return { pageProps }
}

export default App
