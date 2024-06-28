import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'

export default  {
  logo: <span>Camelina-hub documentation</span>,
  project: {
    link: 'https://github.com/usadellab/untwistApp',
  },

  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s '
      }
    }
  },
  
  chat: {
    // link: 'https://discord.com',
  },
  docsRepositoryBase: 'https://github.com/usadellab/untwistApp/tree/documentation',
  footer: {
    text: 'Camelina-hub documentation',
  },
}

// export default config