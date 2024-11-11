import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ReduxProvider } from '@/utils/redux/provider'
import { MUIThemeRegistry } from '@/styles/provider'
import { SWRConfigProvider } from '@/utils/providers/SWRConfigProvider'
import type { Session } from 'next-auth'
import NextAuthProvider from '@/utils/providers/NextAuthProvider'
import { Navigation } from '@/components/global/Navigation'
import Script from 'next/script'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
})

export const metadata: Metadata = {
  title: 'Food Sharing App',
  description: 'A food sharing app built with Next.js',
}

export default function RootLayout({
  children,
  session
}: Readonly<{
  children: React.ReactNode
  session: Session
}>) {
  return (
    <html lang='en'>
      <head>
        <link
          href='https://fonts.googleapis.com/icon?family=Material+Icons'
          rel='stylesheet'
        ></link>
        <link
          href='https://fonts.googleapis.com/icon?family=Material+Icons+Outlined'
          rel='stylesheet'
        ></link>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider session={session}>
          <MUIThemeRegistry options={{ key: 'mui' }}>
            <ReduxProvider>
              <SWRConfigProvider>
                <div>
                  <Navigation />
                  {children}
                </div>
              </SWRConfigProvider>
            </ReduxProvider>
          </MUIThemeRegistry>
        </NextAuthProvider>
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
