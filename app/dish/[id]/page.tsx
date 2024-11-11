'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
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
    phone: string
    address: string
  }
  claimed: boolean
  claimRequests: {
    id: string
    status: string
    userId: string
  }[]
}

export default function DishDetails({ params }: { params: { id: string } }) {
  const [dish, setDish] = useState<Dish | null>(null)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    fetchDish()
  }, [])

  const fetchDish = async () => {
    try {
      const response = await fetch(`/api/dishes/${params?.id}`)
      if (response.ok) {
        const data = await response.json()
        setDish(data)
      } else {
        throw new Error('Failed to fetch dish')
      }
    } catch (error) {
      console.error('Error fetching dish:', error)
      toast({ title: 'Failed to fetch dish details', variant: 'destructive' })
    }
  }

  const handleClaimRequest = async () => {
    try {
      const response = await fetch(`/api/dishes/${params?.id}/claim`, {
        method: 'POST',
      })
      if (response.ok) {
        toast({ title: 'Claim request sent successfully' })
        fetchDish() // Refresh the dish details after requesting
      } else {
        throw new Error('Failed to request dish')
      }
    } catch (error) {
      console.error('Error requesting dish:', error)
      toast({ title: 'Failed to request dish', variant: 'destructive' })
    }
  }

  if (!dish) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-green-800 mb-4">{dish?.name}</h1>
        {dish?.imageUrl && (
          <img src={dish?.imageUrl} alt={dish?.name} className="w-full h-64 object-cover rounded-md mb-4" />
        )}
        <p className="text-gray-600 mb-2">Servings: {dish?.servings}</p>
        <p className="text-gray-600 mb-2">Type: {dish?.type}</p>
        <p className="text-gray-600 mb-4">{dish?.description}</p>
        <h2 className="text-xl font-semibold mb-2">Supplier Information</h2>
        <p className="text-gray-600 mb-2">Name: {dish?.supplier.name}</p>
        <p className="text-gray-600 mb-2">Phone: {dish?.supplier.phone}</p>
        <p className="text-gray-600 mb-4">Address: {dish?.supplier.address}</p>
        {session && !dish?.claimed && dish?.supplier?.id !== (session?.user as any)?.id && (
          dish?.claimRequests?.some(request => request?.userId === (session?.user as any)?.id && request.status === 'PENDING') ? (
            <p className="text-yellow-600 font-semibold">Claim request pending</p>
          ) : (
            <Button onClick={handleClaimRequest} className="w-full mb-2">
              Request to Claim
            </Button>
          )
        )}
        {session && dish?.supplier.id === (session.user as any).id && (
          <Button onClick={() => router.push(`/manage-claim/${dish?.id}`)} className="w-full mb-2">
            Manage Claims
          </Button>
        )}
        {dish?.claimed && (
          <p className="text-red-600 font-semibold">This dish has been claimed</p>
        )}
        <Button onClick={() => router.push('/feed')} className="w-full mt-4">
          Back to Feed
        </Button>
      </div>
    </div>
  )
}