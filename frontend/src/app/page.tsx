import Image from 'next/image'
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex h-full flex-col items-center justify-between p-24">

      <h1>Willkommen</h1>
        <h2><Link href={'/home'} className={'p-2 px-4 rounded hover:bg-orange-500/20 cursor-pointer'}>Go to <b>Home</b></Link></h2>

    </main>
  )
}
