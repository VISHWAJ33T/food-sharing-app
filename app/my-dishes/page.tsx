'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
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
import { Trash2, Edit, Check } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Dish {
  id: string
  name: string
  servings: number
  type: 'VEG' | 'NON_VEG'
  description: string
  imageUrl: string | null
  createdAt: string
  claimed: boolean
}

export default function MyDishes() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    const fetchMyDishes = async () => {
      try {
        const response = await fetch('/api/my-dishes')
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

    if ((session?.user as any)?.userType === 'SUPPLIER') {
      fetchMyDishes()
    }
  }, [session])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/dishes/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setDishes(dishes.filter(dish => dish.id !== id))
        toast({ title: 'Dish deleted successfully' })
      } else {
        throw new Error('Failed to delete dish')
      }
    } catch (error) {
      console.error('Error deleting dish:', error)
      toast({ title: 'Failed to delete dish', variant: 'destructive' })
    }
  }

  const handleClaim = async (id: string) => {
    try {
      const response = await fetch(`/api/dishes/${id}/claim`, {
        method: 'PUT'
      })

      if (response.ok) {
        setDishes(
          dishes.map(dish =>
            dish.id === id ? { ...dish, claimed: true } : dish
          )
        )
        toast({ title: 'Dish marked as claimed' })
      } else {
        throw new Error('Failed to claim dish')
      }
    } catch (error) {
      console.error('Error claiming dish:', error)
      toast({ title: 'Failed to claim dish', variant: 'destructive' })
    }
  }

  if ((session?.user as any)?.userType !== 'SUPPLIER') {
    return <div className='p-4'>You do not have access to this page.</div>
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-green-100 to-green-200 p-4 pb-20'>
      <h1 className='mb-6 text-center text-3xl font-bold text-green-800'>
        My Posted Dishes
      </h1>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {dishes.map(dish => (
          <Card
            key={dish.id}
            className='transition-shadow duration-300 hover:shadow-lg'
          >
            <CardHeader>
              <div className='relative mb-4 h-48 w-full'>
                <Image
                  src={dish.imageUrl || '/placeholder.svg?height=192&width=384'}
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
              {dish.claimed && (
                <Badge variant='outline' className='ml-2'>
                  Claimed
                </Badge>
              )}
              <p className='mt-2 text-sm text-gray-600'>{dish.description}</p>
              <p className='mt-2 text-xs text-gray-400'>
                Posted: {new Date(dish.createdAt).toLocaleString()}
              </p>
              <div className='mt-4 flex justify-between'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => router.push(`/edit-dish/${dish.id}`)}
                >
                  <Edit className='mr-2 h-4 w-4' />
                  Edit
                </Button>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => handleDelete(dish.id)}
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete
                </Button>
              </div>
              {!dish.claimed && (
                <Button
                  variant='secondary'
                  size='sm'
                  className='mt-2 w-full'
                  onClick={() => handleClaim(dish.id)}
                >
                  <Check className='mr-2 h-4 w-4' />
                  Mark as Claimed
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
