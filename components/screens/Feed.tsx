'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Dish {
  id: string
  name: string
  servings: number
  type: 'VEG' | 'NON_VEG'
  description: string
  imageUrl: string | null
}

export default function Feed() {
  const [dishes, setDishes] = useState<Dish[]>([])

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch('/api/dishes')
        if (response.ok) {
          const data = await response.json()
          setDishes(data)
        } else {
          throw new Error('Failed to fetch dishes')
        }
      } catch (error) {
        console.error('Error fetching dishes:', error)
      }
    }

    fetchDishes()
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-b from-green-100 to-green-200 p-4 pb-20'>
      <h1 className='mb-6 text-center text-3xl font-bold text-green-800'>
        Available Dishes
      </h1>
      <div className='grid grid-cols-1 gap-4'>
        {dishes.map(dish => (
          <Link href={`/dish/${dish.id}`} key={dish.id}>
            <Card className='transition-shadow duration-300 hover:shadow-lg'>
              <CardHeader>
                <div className='relative mb-4 h-48 w-full'>
                  <Image
                    src={
                      dish.imageUrl || '/placeholder.svg?height=192&width=384'
                    }
                    alt={dish.name}
                    layout='fill'
                    objectFit='cover'
                    className='rounded-t-lg'
                  />
                </div>
                <CardTitle>{dish.name}</CardTitle>
                <CardDescription>Serves {dish.servings} people</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={dish.type === 'VEG' ? 'secondary' : 'destructive'}
                >
                  {dish.type === 'VEG' ? 'Vegetarian' : 'Non-Vegetarian'}
                </Badge>
                <p className='mt-2 text-sm text-gray-600'>{dish.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
