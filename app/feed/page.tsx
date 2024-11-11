'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'

interface Dish {
  id: string
  name: string
  servings: number
  type: 'VEG' | 'NON_VEG'
  description: string
  imageUrl: string | null
  supplier: {
    id: string
    name: string
  }
  claimed: boolean
  claimRequests: {
    id: string
    status: string
    userId: string
  }[]
}

export default function Feed() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [showNonVeg, setShowNonVeg] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('showNonVeg')
      return saved !== null ? JSON.parse(saved) : true
    }
    return true
  })
  const { data: session } = useSession()

  useEffect(() => {
    fetchDishes()
  }, [showNonVeg])

  useEffect(() => {
    localStorage.setItem('showNonVeg', JSON.stringify(showNonVeg))
  }, [showNonVeg])

  const fetchDishes = async () => {
    try {
      const response = await fetch(`/api/dishes?showNonVeg=${showNonVeg}`)
      if (response.ok) {
        const data = await response.json()
        setDishes(data)
      } else {
        throw new Error('Failed to fetch dishes')
      }
    } catch (error) {
      console.error('Error fetching dishes:', error)
      toast({ title: 'Failed to fetch dishes', variant: 'destructive' })
    }
  }

  const handleClaimRequest = async (id: string) => {
    try {
      const response = await fetch(`/api/dishes/${id}/claim`, {
        method: 'POST'
      })
      if (response.ok) {
        toast({ title: 'Claim request sent successfully' })
        fetchDishes() // Refresh the list after requesting
      } else {
        throw new Error('Failed to request dish')
      }
    } catch (error) {
      console.error('Error requesting dish:', error)
      toast({ title: 'Failed to request dish', variant: 'destructive' })
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-green-100 to-green-200 p-4'>
      <div className='mx-auto max-w-4xl'>
        <h1 className='mb-6 text-3xl font-bold text-green-800'>
          Available Dishes
        </h1>
        <div className='mb-4 flex items-center space-x-2'>
          <Switch
            id='show-non-veg'
            checked={showNonVeg}
            onCheckedChange={setShowNonVeg}
          />
          <Label htmlFor='show-non-veg'>Show Non-Vegetarian Dishes</Label>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {dishes.map(dish => (
            <div key={dish?.id} className='rounded-lg bg-white p-4 shadow-md'>
              {dish?.imageUrl && (
                <img
                  src={dish?.imageUrl}
                  alt={dish?.name}
                  className='mb-2 h-48 w-full rounded-md object-cover'
                />
              )}
              <h2 className='mb-2 text-xl font-semibold'>{dish?.name}</h2>
              <p className='mb-2 text-gray-600'>Servings: {dish?.servings}</p>
              <p className='mb-2 text-gray-600'>Type: {dish?.type}</p>
              <p className='mb-2 text-gray-600'>
                Supplier: {dish?.supplier.name}
              </p>
              <p className='mb-4 text-gray-600'>{dish?.description}</p>
              <div className='flex space-x-2'>
                <Link href={`/dish/${dish?.id}`} passHref>
                  <Button className='flex-1'>View Details</Button>
                </Link>
                {session &&
                  !dish?.claimed &&
                  dish?.supplier.id !== (session?.user as any)?.id &&
                  (dish?.claimRequests?.some(
                    request =>
                      request?.userId === (session?.user as any)?.id &&
                      request?.status === 'PENDING'
                  ) ? (
                    <p className='flex items-center font-semibold text-yellow-600'>
                      Claim request pending
                    </p>
                  ) : (
                    <Button
                      onClick={() => handleClaimRequest(dish?.id)}
                      className='flex-1'
                    >
                      Request to Claim
                    </Button>
                  ))}
                {session &&
                  dish?.supplier?.id === (session?.user as any)?.id && (
                    <Link href={`/manage-claim/${dish?.id}`} passHref>
                      <Button className='flex-1'>Manage Claims</Button>
                    </Link>
                  )}
              </div>
              {dish?.claimed && (
                <p className='mt-2 font-semibold text-red-600'>
                  This dish has been claimed
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
