import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/prisma/prisma'
import { authOptions } from '../../../auth/[...nextauth]/route'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.userType !== 'SUPPLIER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const dish = await prisma.dish.findUnique({
      where: { id: params.id },
    })

    if (!dish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 })
    }

    if (dish.supplierId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updatedDish = await prisma.dish.update({
      where: { id: params.id },
      data: { claimed: true },
    })

    return NextResponse.json(updatedDish)
  } catch (error) {
    console.error('Error claiming dish:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}