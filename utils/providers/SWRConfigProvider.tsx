'use client'

import { SWRConfig } from 'swr'
import { defaultFetcher } from '../fetchers'

export const SWRConfigProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: defaultFetcher
      }}
    >
      {children}
    </SWRConfig>
  )
}
