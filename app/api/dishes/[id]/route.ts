import { NextResponse } from 'next/server'
import {prisma} from '@/prisma/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const dish = await prisma.dish.findUnique({
      where: { id: params.id },
      include: {
        supplier: {
          select: {
            name: true,
            address: true,
            phone: true,
          },
        },
      },
    })

    if (!dish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 })
    }

    return NextResponse.json(dish)
  } catch (error) {
    console.error('Error fetching dish:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}