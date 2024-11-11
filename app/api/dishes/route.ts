import { NextResponse } from 'next/server'
import { prisma } from '@/prisma/prisma'

export async function GET() {
  try {
    const dishes = await prisma.dish.findMany({
      include: {
        supplier: {
          select: {
            name: true
          }
        }
      }
    })
    return NextResponse.json(dishes)
  } catch (error) {
    console.error('Error fetching dishes:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      servings,
      type,
      description,
      imageUrl,
      pickupAddress,
      supplierId
    } = body

    const dish = await prisma.dish.create({
      data: {
        name,
        servings: parseInt(servings),
        type,
        description,
        imageUrl,
        pickupAddress,
        supplierId
      }
    })

    return NextResponse.json(dish, { status: 201 })
  } catch (error) {
    console.error('Error creating dish:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
