import './globals.css'
import Header from "@iot-portal/frontend/app/common/Header";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
        <body className={`${inter.className} min-h-screen h-max flex`}>
            <div className={'flex flex-1 flex-col '}>
              <Header/>
              {children}
            </div>
        </body>
    </html>
  )
}

