'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/feed')
    }
  }, [status, router])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false
      })

      if (result?.error) {
        toast({
          title: 'Login failed',
          description: 'Invalid username or password',
          variant: 'destructive'
        })
      } else {
        router.push('/feed')
      }
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: 'Please try again later',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'authenticated') {
    return null
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-100 to-green-200 p-4'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-md'>
        <h2 className='mb-6 text-center text-2xl font-bold text-green-800'>
          Login
        </h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='username'>Username</Label>
            <Input id='username' name='username' required />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <Input id='password' name='password' type='password' required />
          </div>
          <Button
            type='submit'
            className='w-full bg-green-500 text-white hover:bg-green-600'
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <div className='mt-4 text-center'>
          <p className='text-sm text-gray-600'>
            Don't have an account?{' '}
            <Link href='/register' className='text-green-600 hover:underline'>
              Register here
            </Link>
          </p>
        </div>
        <div className='mt-4 text-center'>
          <Link href='/' className='text-green-600 hover:underline'>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
