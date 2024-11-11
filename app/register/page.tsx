'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'

export default function Register() {
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
    const userData = Object.fromEntries(formData.entries())

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        toast({ title: 'Registration successful' })
        router.push('/login')
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Registration failed')
      }
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message,
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
          Register
        </h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='fullName'>Full Name</Label>
            <Input id='fullName' name='fullName' required />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='username'>Username</Label>
            <Input id='username' name='username' required />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' name='email' type='email' required />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='phone'>Phone Number</Label>
            <Input id='phone' name='phone' type='tel' required />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='address'>Address</Label>
            <Input id='address' name='address' required />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='aadharNo'>Aadhar Number</Label>
            <Input id='aadharNo' name='aadharNo' required />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <Input id='password' name='password' type='password' required />
          </div>
          <Button
            type='submit'
            className='w-full bg-blue-500 text-white hover:bg-blue-600'
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-green-600 hover:underline">
              Login here
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