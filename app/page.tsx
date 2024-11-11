import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-100 to-green-200 p-4'>
      <h1 className='mb-8 text-3xl font-bold text-green-800'>
        Food Sharing App
      </h1>
      <div className='w-full max-w-xs space-y-4'>
        <Link href='/login' className='w-full'>
          <Button className='w-full bg-green-500 text-white hover:bg-green-600'>
            Login
          </Button>
        </Link>
        <Link href='/register' className='w-full'>
          <Button className='w-full bg-blue-500 text-white hover:bg-blue-600'>
            Register
          </Button>
        </Link>
        <Link href='/about' className='w-full'>
          <Button
            variant='outline'
            className='w-full border-green-500 text-green-700 hover:bg-green-100'
          >
            About Us
          </Button>
        </Link>
      </div>
    </div>
  )
}
