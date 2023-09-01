import Image from 'next/image'
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex h-full flex-col items-center justify-between p-24">

      <h1>Willkommen</h1>
        <h2>Go to <Link href={'/home'}>Home</Link></h2>

    </main>
  )
}
