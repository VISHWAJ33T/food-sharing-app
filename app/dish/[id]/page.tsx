'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Dish {
  id: string
  name: string
  servings: number
  type: 'VEG' | 'NON_VEG'
  description: string
  imageUrl: string | null
  pickupAddress: string
  supplier: {
    name: string
    address: string
    phone: string
  }
}

export default function DishDetails({ params }: { params: { id: string } }) {
  const [dish, setDish] = useState<Dish | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const response = await fetch(`/api/dishes/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setDish(data)
        } else {
          throw new Error('Failed to fetch dish details')
        }
      } catch (error) {
        console.error('Error fetching dish details:', error)
      }
    }

    fetchDish()
  }, [params.id])

  if (!dish) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-green-100 to-green-200'>
        Loading...
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-green-100 to-green-200 p-4'>
      <Card className='mx-auto max-w-2xl'>
        <CardHeader>
          <div className='relative mb-4 h-64 w-full'>
            <Image
              src={dish.imageUrl || '/placeholder.svg?height=256&width=512'}
              alt={dish.name}
              layout='fill'
              objectFit='cover'
              className='rounded-t-lg'
            />
          </div>
          <CardTitle className='text-2xl font-bold text-green-800'>
            {dish.name}
          </CardTitle>
          <CardDescription>Serves {dish.servings} people</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Badge variant={dish.type === 'VEG' ? 'default' : 'destructive'}>
            {dish.type === 'VEG' ? 'Vegetarian' : 'Non-Vegetarian'}
          </Badge>
          <p className='text-gray-600'>{dish.description}</p>
          <div className='border-t pt-4'>
            <h3 className='mb-2 text-lg font-semibold'>Supplier Details</h3>
            <p>
              <strong>Name:</strong> {dish.supplier.name}
            </p>
            <p>
              <strong>Phone:</strong> {dish.supplier.phone}
            </p>
            <p>
              <strong>Pickup Address:</strong>{' '}
              {dish.pickupAddress || dish.supplier.address}
            </p>
          </div>
          <Button
            className='w-full bg-green-500 text-white hover:bg-green-600'
            onClick={() => router.push('/feed')}
          >
            Back to Feed
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
