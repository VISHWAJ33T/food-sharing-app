'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Dish {
  id: string
  name: string
  servings: number
  type: 'VEG' | 'NON_VEG'
  description: string
  imageUrl: string | null
  createdAt: string
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
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 p-4 pb-20">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-6">Available Dishes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dishes.map((dish) => (
          <Link href={`/dish/${dish.id}`} key={dish.id}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={dish.imageUrl || '/placeholder.svg?height=192&width=384'}
                    alt={dish.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <CardTitle>{dish.name}</CardTitle>
                <CardDescription>Serves {dish.servings} people</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant={dish.type === 'VEG' ? 'default' : 'destructive'}>
                  {dish.type === 'VEG' ? 'Vegetarian' : 'Non-Vegetarian'}
                </Badge>
                <p className="mt-2 text-sm text-gray-600">{dish.description}</p>
                <p className="mt-2 text-xs text-gray-400">Posted: {new Date(dish.createdAt).toLocaleString()}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}