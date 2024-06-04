"use client"
import { useRouter } from 'next/navigation';

const dynamic = 'force-dynamic';

const Page = ({params}: { params: { id: number } }) => {


    const router = useRouter()
    router.push('dashboards');

}
export default Page;
