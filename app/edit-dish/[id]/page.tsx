'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"

interface Dish {
  id: string
  name: string
  servings: number
  type: 'VEG' | 'NON_VEG'
  description: string
  imageUrl: string | null
}

export default function EditDish({ params }: { params: { id: string } }) {
  const [dish, setDish] = useState<Dish | null>(null)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const response = await fetch(`/api/dishes/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setDish(data)
        } else {
          throw new Error('Failed to fetch dish')
        }
      } catch (error) {
        console.error('Error fetching dish:', error)
        toast({ title: "Failed to fetch dish", variant: "destructive" })
      }
    }

    if ((session?.user as any)?.userType === 'SUPPLIER') {
      fetchDish()
    }
  }, [params.id, session])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!dish) return

    try {
      const response = await fetch(`/api/dishes/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dish),
      })

      if (response.ok) {
        toast({ title: "Dish updated successfully" })
        router.push('/my-dishes')
      } else {
        throw new Error('Failed to update dish')
      }
    } catch (error) {
      console.error('Error updating dish:', error)
      toast({ title: "Failed to update dish", variant: "destructive" })
    }
  }

  if (!dish) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Dish</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Dish Name</Label>
            <Input
              id="name"
              value={dish.name}
              onChange={(e) => setDish({ ...dish, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="servings">Number of Servings</Label>
            <Input
              id="servings"
              type="number"
              value={dish.servings}
              onChange={(e) => setDish({ ...dish, servings: parseInt(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label>Type</Label>
            <RadioGroup
              value={dish.type}
              onValueChange={(value) => setDish({ ...dish, type: value as 'VEG' | 'NON_VEG' })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="VEG" id="veg" />
                <Label htmlFor="veg">Vegetarian</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="NON_VEG" id="non-veg" />
                <Label htmlFor="non-veg">Non-Vegetarian</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={dish.description}
              onChange={(e) => setDish({ ...dish, description: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full">Update Dish</Button>
        </form>
      </div>
    </div>
  )
}